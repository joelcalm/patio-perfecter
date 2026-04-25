import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Mi carrito — Leroy Merlin" }] }),
});

function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-[1400px] px-4 py-12 w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-6">Explora el catálogo o usa Patio Designer para inspirarte.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/productos" className="bg-brand text-brand-foreground font-semibold px-5 py-2.5 rounded hover:bg-brand-dark">
            Ver productos
          </Link>
          <Link to="/patio-designer" className="border border-brand text-brand-dark font-semibold px-5 py-2.5 rounded hover:bg-accent">
            Diseñar mi patio
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
