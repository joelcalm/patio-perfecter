import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useDesigner, designerStore } from "@/lib/designer-store";
import { products, getProduct } from "@/lib/products";
import { useState, useRef } from "react";
import { Upload, Plus, X, Sparkles, ShoppingCart, Send, Save, Search, Loader2, Check, AlertCircle } from "lucide-react";
import { generatePatioDesignVariation } from "@/utils/generate-design.functions";

const VARIATION_META = [
  { id: "balanced" as const, title: "Diseño acogedor y equilibrado", description: "Distribución natural con los productos colocados de forma armónica para uso diario." },
  { id: "social" as const, title: "Distribución para reuniones", description: "Composición orientada a la sociabilización, maximizando los asientos y zona común." },
  { id: "airy" as const, title: "Versión luminosa y despejada", description: "Disposición más abierta, con los productos algo separados para sensación de amplitud." },
];

export const Route = createFileRoute("/patio-designer")({
  component: PatioDesignerPage,
  head: () => ({
    meta: [
      { title: "Patio Designer — Diseña tu terraza | Leroy Merlin" },
      {
        name: "description",
        content:
          "Sube una foto de tu patio, elige productos reales del catálogo y visualiza cómo queda tu nueva terraza antes de comprar.",
      },
    ],
  }),
});

const STYLES = [
  { id: "modern", label: "Moderno" },
  { id: "mediterranean", label: "Mediterráneo" },
  { id: "minimalist", label: "Minimalista" },
  { id: "rustic", label: "Rústico" },
  { id: "luxury", label: "Lujo" },
];

type DesignResult = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  error: string | null;
};

async function urlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read error"));
    reader.readAsDataURL(blob);
  });
}

function PatioDesignerPage() {
  const state = useDesigner();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<DesignResult[] | null>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedProducts = Object.entries(state.selectedProductIds)
    .map(([id, qty]) => {
      const p = getProduct(id);
      return p ? { product: p, qty } : null;
    })
    .filter(Boolean) as { product: ReturnType<typeof getProduct> & {}; qty: number }[];

  const totalPrice = selectedProducts.reduce(
    (sum, { product, qty }) => sum + product!.price * qty,
    0,
  );

  const canGenerate = state.patioPhoto && selectedProducts.length > 0 && !generating;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      designerStore.setPatioPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!state.patioPhoto) return;
    setGenerating(true);
    setResults(null);
    setGenError(null);
    try {
      const productPayload = await Promise.all(
        selectedProducts.map(async ({ product, qty }) => ({
          id: product!.id,
          name: product!.name,
          category: product!.category,
          qty,
          imageDataUrl: await urlToDataUrl(product!.image),
        })),
      );

      const { results: generated } = await generatePatioDesigns({
        data: {
          patioImageDataUrl: state.patioPhoto,
          products: productPayload,
          style: state.style,
          details: state.details,
        },
      });

      setResults(generated);
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Error al generar el diseño");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SiteHeader />

      <main className="flex-1 mx-auto max-w-[1400px] px-4 py-6 w-full">
        <nav className="text-xs text-muted-foreground mb-3">
          <Link to="/" className="hover:text-foreground">Inicio</Link> › <span className="text-foreground">Patio Designer</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-brand" /> Patio Designer
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Sube una foto de tu patio o terraza, elige productos reales del catálogo y descubre cómo queda tu nuevo espacio antes de comprar.
          </p>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Left config panel */}
          <aside className="space-y-4">
            <Panel title="1. Sube tu patio">
              {state.patioPhoto ? (
                <div className="relative group">
                  <img src={state.patioPhoto} alt="Tu patio" className="w-full h-48 object-cover rounded" />
                  <button
                    onClick={() => designerStore.setPatioPhoto(null)}
                    className="absolute top-2 right-2 bg-background/90 p-1.5 rounded-full hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-2 hover:border-brand hover:bg-accent/40 transition-colors"
                >
                  <Upload className="h-8 w-8 text-brand-dark" />
                  <span className="text-sm font-semibold">Subir foto</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Arrastra una imagen o haz click<br/>JPG, PNG hasta 10 MB
                  </span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </Panel>

            <Panel title="2. Productos seleccionados">
              {selectedProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no has añadido productos.</p>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map(({ product, qty }) => (
                    <div key={product!.id} className="flex gap-3 items-start border-b border-border pb-3 last:border-0 last:pb-0">
                      <img src={product!.image} alt="" className="w-14 h-14 object-contain bg-white rounded border border-border" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-2">{product!.name}</p>
                        <p className="text-sm font-bold mt-0.5">{product!.price.toFixed(2)}€</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center border border-border rounded text-xs">
                            <button onClick={() => designerStore.setQty(product!.id, qty - 1)} className="px-2 hover:bg-muted">−</button>
                            <span className="px-2">{qty}</span>
                            <button onClick={() => designerStore.setQty(product!.id, qty + 1)} className="px-2 hover:bg-muted">+</button>
                          </div>
                          <button onClick={() => designerStore.removeProduct(product!.id)} className="text-xs text-muted-foreground hover:text-destructive">
                            Quitar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                    <span>Total</span>
                    <span>{totalPrice.toFixed(2)}€</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setCatalogOpen(true)}
                className="w-full mt-3 flex items-center justify-center gap-2 border border-brand text-brand-dark font-semibold py-2 rounded hover:bg-accent transition-colors text-sm"
              >
                <Plus className="h-4 w-4" /> Añadir productos
              </button>
            </Panel>

            <Panel title="3. Estilo">
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => designerStore.setStyle(s.id)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      state.style === s.id
                        ? "bg-brand text-brand-foreground border-brand"
                        : "border-border hover:border-brand"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="4. Detalles adicionales">
              <textarea
                value={state.details}
                onChange={(e) => designerStore.setDetails(e.target.value)}
                placeholder="Quiero más sombra, espacio pequeño, fácil mantenimiento..."
                className="w-full text-sm border border-border rounded p-2 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </Panel>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full bg-brand text-brand-foreground font-bold py-4 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base shadow-sm"
            >
              {generating ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Diseñando tu patio ideal…</>
              ) : (
                <><Sparkles className="h-5 w-5" /> Generar diseño de patio</>
              )}
            </button>
            {!canGenerate && !generating && (
              <p className="text-xs text-muted-foreground text-center">
                {!state.patioPhoto ? "Sube una foto de tu patio para empezar" : "Añade al menos un producto"}
              </p>
            )}
          </aside>

          {/* Right results */}
          <section className="space-y-4">
            {!results && !generating && (
              <EmptyResults hasPhoto={!!state.patioPhoto} />
            )}

            {generating && (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-brand mx-auto mb-4" />
                <p className="text-lg font-semibold">Diseñando tu patio ideal…</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Estamos colocando los productos seleccionados en tu espacio.
                </p>
              </div>
            )}

            {genError && !generating && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 flex items-start gap-2 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">No se pudo generar el diseño</p>
                  <p>{genError}</p>
                </div>
              </div>
            )}

            {results && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">3 propuestas para tu patio</h2>
                  <button
                    onClick={handleGenerate}
                    className="text-sm font-semibold text-brand-dark hover:underline"
                  >
                    Generar de nuevo
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {results.map((r) => (
                    <ResultCard key={r.id} result={r} totalPrice={totalPrice} products={selectedProducts} />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {catalogOpen && <CatalogModal onClose={() => setCatalogOpen(false)} />}

      <SiteFooter />
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function EmptyResults({ hasPhoto }: { hasPhoto: boolean }) {
  return (
    <div className="bg-card border-2 border-dashed border-border rounded-lg p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
        <Sparkles className="h-8 w-8 text-brand" />
      </div>
      <h2 className="text-xl font-bold mb-2">Tu nuevo patio aparecerá aquí</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        {hasPhoto
          ? "Añade productos del catálogo y pulsa Generar para ver 3 propuestas en tu propio espacio."
          : "Sube una foto de tu patio, elige productos y genera 3 propuestas de diseño realistas."}
      </p>
    </div>
  );
}

function ResultCard({
  result,
  totalPrice,
  products: selected,
}: {
  result: DesignResult;
  totalPrice: number;
  products: { product: ReturnType<typeof getProduct> & {}; qty: number }[];
}) {
  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      {result.image ? (
        <img src={result.image} alt={result.title} className="w-full aspect-[4/3] object-cover" loading="lazy" />
      ) : (
        <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center text-center p-4">
          <div className="text-xs text-destructive flex flex-col items-center gap-2">
            <AlertCircle className="h-6 w-6" />
            <span>{result.error || "No se pudo generar"}</span>
          </div>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold leading-snug">{result.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{result.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {selected.slice(0, 4).map(({ product }) => (
            <span key={product!.id} className="text-[11px] bg-muted px-2 py-1 rounded-full truncate max-w-[140px]">
              {product!.name.split(" ").slice(0, 3).join(" ")}
            </span>
          ))}
          {selected.length > 4 && (
            <span className="text-[11px] bg-muted px-2 py-1 rounded-full">+{selected.length - 4}</span>
          )}
        </div>

        <div className="flex items-baseline justify-between mt-4 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Total productos</span>
          <span className="text-xl font-extrabold">{totalPrice.toFixed(2)}€</span>
        </div>

        <div className="space-y-2 mt-3">
          <button className="w-full flex items-center justify-center gap-2 bg-brand text-brand-foreground font-semibold py-2 rounded hover:bg-brand-dark text-sm">
            <ShoppingCart className="h-4 w-4" /> Añadir todo al carrito
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-1 border border-border py-1.5 rounded hover:bg-muted text-xs font-medium">
              <Send className="h-3 w-3" /> Enviar
            </button>
            <button className="flex items-center justify-center gap-1 border border-border py-1.5 rounded hover:bg-muted text-xs font-medium">
              <Save className="h-3 w-3" /> Guardar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function CatalogModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const state = useDesigner();
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center gap-3">
          <h2 className="text-lg font-bold">Catálogo de productos</h2>
          <div className="relative flex-1 max-w-md ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full border border-border rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <button onClick={onClose} className="ml-auto p-2 hover:bg-muted rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((p) => {
            const added = !!state.selectedProductIds[p.id];
            return (
              <div key={p.id} className="border border-border rounded p-3 flex flex-col">
                <img src={p.image} alt={p.name} loading="lazy" className="aspect-square object-contain bg-white" />
                <p className="text-xs font-medium mt-2 line-clamp-2 min-h-[32px]">{p.name}</p>
                <p className="font-bold text-sm mt-1">{p.price.toFixed(2)}€</p>
                <button
                  onClick={() => designerStore.addProduct(p.id, 1)}
                  className={`mt-2 text-xs font-semibold py-1.5 rounded flex items-center justify-center gap-1 ${
                    added
                      ? "bg-accent text-brand-dark"
                      : "bg-brand text-brand-foreground hover:bg-brand-dark"
                  }`}
                >
                  {added ? <><Check className="h-3 w-3" /> Añadido</> : <><Plus className="h-3 w-3" /> Añadir</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
