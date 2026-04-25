import { createServerFn } from "@tanstack/react-start";

type ProductRef = {
  id: string;
  name: string;
  category: string;
  qty: number;
  imageDataUrl: string; // data:image/...;base64,...
};

type GenerateInput = {
  patioImageDataUrl: string; // user uploaded
  products: ProductRef[];
  style: string;
  details: string;
};

const VARIATIONS = [
  {
    title: "Diseño acogedor y equilibrado",
    description:
      "Distribución natural con los productos colocados de forma armónica para uso diario.",
    twist:
      "Place the selected products in a balanced, inviting layout. Keep changes minimal and natural.",
  },
  {
    title: "Distribución para reuniones",
    description:
      "Composición orientada a la sociabilización, maximizando los asientos y zona común.",
    twist:
      "Arrange the products to maximize seating and a social gathering layout. Slightly warmer light.",
  },
  {
    title: "Versión luminosa y despejada",
    description:
      "Disposición más abierta, con los productos algo separados para sensación de amplitud.",
    twist:
      "Spread the products to create an open, airy feel with more negative space and brighter lighting.",
  },
];

async function generateOne(
  apiKey: string,
  input: GenerateInput,
  variation: (typeof VARIATIONS)[number],
): Promise<string> {
  const productList = input.products
    .map((p) => `- ${p.qty}× ${p.name} (${p.category})`)
    .join("\n");

  const promptText = `You are an interior/exterior design visualization assistant for a home improvement retailer.

TASK: Edit the FIRST image (the user's actual patio/terrace photo) by realistically adding the products shown in the subsequent images into the scene.

CRITICAL RULES:
- The base patio MUST remain the user's uploaded photo. Keep walls, floor, perspective, lighting direction, sky, existing structures and proportions intact.
- Do NOT replace the patio with a different one. Only add/place the provided products into the existing scene.
- Match perspective, scale, shadows and lighting so the additions look photoreal.
- Only add small decorative tweaks (a couple of plants, subtle ambient light) if it helps the composition.

Selected products to place (provided as reference images after the patio photo):
${productList}

Style preference: ${input.style}
Additional notes from user: ${input.details || "(none)"}

Variation focus: ${variation.twist}

Return a single edited photograph of the SAME patio with the products realistically added.`;

  const content: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } }
  > = [
    { type: "text", text: promptText },
    { type: "image_url", image_url: { url: input.patioImageDataUrl } },
  ];

  for (const p of input.products) {
    content.push({
      type: "text",
      text: `Product: ${p.name}`,
    });
    content.push({
      type: "image_url",
      image_url: { url: p.imageDataUrl },
    });
  }

  const response = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content }],
        modalities: ["image", "text"],
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    if (response.status === 429) {
      throw new Error("Rate limit alcanzado. Inténtalo de nuevo en unos segundos.");
    }
    if (response.status === 402) {
      throw new Error(
        "Se han agotado los créditos de Lovable AI. Añade créditos en Settings → Workspace → Usage.",
      );
    }
    throw new Error(`AI gateway error [${response.status}]: ${text}`);
  }

  const data = await response.json();
  const imageUrl: string | undefined =
    data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

  if (!imageUrl) {
    throw new Error("La IA no devolvió una imagen. Inténtalo de nuevo.");
  }

  return imageUrl;
}

export const generatePatioDesigns = createServerFn({ method: "POST" })
  .inputValidator((input: GenerateInput) => {
    if (!input || typeof input !== "object") throw new Error("Invalid input");
    if (!input.patioImageDataUrl?.startsWith("data:image/")) {
      throw new Error("Foto del patio inválida");
    }
    if (!Array.isArray(input.products) || input.products.length === 0) {
      throw new Error("Selecciona al menos un producto");
    }
    if (input.products.length > 8) {
      throw new Error("Máximo 8 productos por diseño");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const results = await Promise.all(
      VARIATIONS.map(async (v) => {
        try {
          const image = await generateOne(apiKey, data, v);
          return {
            id: v.title,
            title: v.title,
            description: v.description,
            image,
            error: null as string | null,
          };
        } catch (e) {
          return {
            id: v.title,
            title: v.title,
            description: v.description,
            image: null as string | null,
            error: e instanceof Error ? e.message : "Error desconocido",
          };
        }
      }),
    );

    return { results };
  });
