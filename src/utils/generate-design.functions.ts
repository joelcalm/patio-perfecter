import { createServerFn } from "@tanstack/react-start";

type ProductRef = {
  id: string;
  name: string;
  category: string;
  qty: number;
  imageDataUrl: string;
};

type GenerateInput = {
  patioImageDataUrl: string;
  products: ProductRef[];
  style: string;
  details: string;
  variationId: "balanced" | "social" | "airy";
};

const VARIATIONS = {
  balanced: {
    title: "Diseño acogedor y equilibrado",
    description:
      "Distribución natural con los productos colocados de forma armónica para uso diario.",
    twist:
      "Place the selected products in a balanced, inviting layout. Keep changes minimal and natural.",
  },
  social: {
    title: "Distribución para reuniones",
    description:
      "Composición orientada a la sociabilización, maximizando los asientos y zona común.",
    twist:
      "Arrange the products to maximize seating and a social gathering layout. Slightly warmer light.",
  },
  airy: {
    title: "Versión luminosa y despejada",
    description:
      "Disposición más abierta, con los productos algo separados para sensación de amplitud.",
    twist:
      "Spread the products to create an open, airy feel with more negative space and brighter lighting.",
  },
} as const;

export const generatePatioDesignVariation = createServerFn({ method: "POST" })
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
    if (!VARIATIONS[input.variationId]) {
      throw new Error("Variación inválida");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const variation = VARIATIONS[data.variationId];
    const productList = data.products
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

Style preference: ${data.style}
Additional notes from user: ${data.details || "(none)"}

Variation focus: ${variation.twist}

Return a single edited photograph of the SAME patio with the products realistically added.`;

    const content: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    > = [
      { type: "text", text: promptText },
      { type: "image_url", image_url: { url: data.patioImageDataUrl } },
    ];

    for (const p of data.products) {
      content.push({ type: "text", text: `Product: ${p.name}` });
      content.push({ type: "image_url", image_url: { url: p.imageDataUrl } });
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
        throw new Error("Demasiadas peticiones. Inténtalo de nuevo en unos segundos.");
      }
      if (response.status === 402) {
        throw new Error(
          "Se han agotado los créditos de Lovable AI. Añade créditos en Settings → Workspace → Usage.",
        );
      }
      throw new Error(`AI gateway error [${response.status}]: ${text.slice(0, 200)}`);
    }

    const json = await response.json();
    const imageUrl: string | undefined =
      json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("La IA no devolvió una imagen. Inténtalo de nuevo.");
    }

    return {
      id: data.variationId,
      title: variation.title,
      description: variation.description,
      image: imageUrl,
    };
  });
