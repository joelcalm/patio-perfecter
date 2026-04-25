import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import heroPatio from "@/assets/hero-patio.jpg";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Leroy Merlin — Patio Designer | Diseña tu terraza con productos reales" },
      {
        name: "description",
        content:
          "Sube una foto de tu patio y visualiza cómo quedan los muebles y productos de Leroy Merlin antes de comprar.",
      },
    ],
  }),
});

function HomePage() {
  const featured = products.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-[1400px] px-4 py-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-promo">
              Recoge tu pedido donde quieras: nosotros nos adaptamos
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Elige entre más de 15.000 puntos y recógelo en menos de 48 horas.
            </p>
          </div>
        </section>

        {/* Hero - Patio Designer feature */}
        <section className="mx-auto max-w-[1400px] px-4 py-8">
          <div className="grid md:grid-cols-[400px_1fr] gap-0 rounded-lg overflow-hidden border border-border bg-card">
            <div className="p-8 md:p-10 flex flex-col justify-center bg-card">
              <div className="inline-flex items-center gap-2 bg-accent text-brand-dark text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-4">
                <Sparkles className="h-3.5 w-3.5" /> NUEVO
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                Diseña tu patio ideal con productos reales
              </h1>
              <p className="text-muted-foreground mb-6">
                Sube una foto de tu terraza, elige productos de nuestro catálogo y descubre
                cómo quedan en tu espacio antes de comprar.
              </p>
              <Link
                to="/patio-designer"
                className="inline-flex items-center justify-center gap-2 bg-brand text-brand-foreground font-semibold px-6 py-3 rounded hover:bg-brand-dark transition-colors w-fit"
              >
                Probar Patio Designer <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[280px] md:min-h-[400px]">
              <img
                src={heroPatio}
                alt="Terraza diseñada con Patio Designer"
                width={1600}
                height={900}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Outdoor products grid */}
        <section className="mx-auto max-w-[1400px] px-4 py-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Outdoor & Terraza</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pulsa <span className="font-semibold text-brand-dark">Ver en mi patio</span> en cualquier producto para visualizarlo en tu espacio.
              </p>
            </div>
            <Link to="/productos" className="text-sm font-semibold text-brand-dark hover:underline">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
