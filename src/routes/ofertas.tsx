import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/ofertas")({
  component: OfertasPage,
  head: () => ({ meta: [{ title: "Ofertas — Leroy Merlin" }] }),
});

function OfertasPage() {
  const ofertas = products.filter((p) => p.oldPrice);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-[1400px] px-4 py-8 w-full">
        <h1 className="text-2xl font-bold mb-1">Ofertas hasta -25%</h1>
        <p className="text-sm text-muted-foreground mb-6">Aprovecha los precios especiales de temporada.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ofertas.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="mt-8">
          <Link to="/" className="text-brand-dark hover:underline">← Volver al inicio</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
