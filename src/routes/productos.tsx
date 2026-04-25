import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/productos")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Productos exterior — Leroy Merlin" },
      { name: "description", content: "Descubre todos los productos para terraza, patio y jardín." },
    ],
  }),
});

function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-[1400px] px-4 py-8 w-full">
        <nav className="text-xs text-muted-foreground mb-3">
          Inicio › Jardín y exterior › <span className="text-foreground">Muebles de exterior</span>
        </nav>
        <h1 className="text-2xl font-bold mb-1">Muebles y decoración de exterior</h1>
        <p className="text-sm text-muted-foreground mb-6">{products.length} productos</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
