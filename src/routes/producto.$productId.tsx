import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getProduct, products } from "@/lib/products";
import { designerStore } from "@/lib/designer-store";
import { Heart, ShoppingCart, Sparkles, Star, Truck, Store, Shield } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/producto/$productId")({
  component: ProductPage,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      <Link to="/productos" className="text-brand-dark underline mt-4 inline-block">
        Volver al catálogo
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const product = getProduct(productId);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-[1400px] px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <Link to="/productos" className="text-brand-dark underline mt-4 inline-block">
            Volver al catálogo
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const handlePreview = () => {
    designerStore.addProduct(product.id, qty);
    navigate({ to: "/patio-designer" });
  };

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-[1400px] px-4 py-6 w-full">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Inicio</Link> ›{" "}
          <Link to="/productos" className="hover:text-foreground">{product.category}</Link> ›{" "}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="bg-white rounded-lg border border-border p-8 flex items-center justify-center min-h-[500px]">
            <img
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="max-h-[500px] object-contain"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{product.brand}</p>
            <h1 className="text-2xl font-bold leading-tight mb-3">{product.name}</h1>
            <div className="flex items-center gap-2 text-sm mb-4">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} opiniones)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-extrabold">{product.price.toFixed(2)}€</span>
              {product.oldPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.oldPrice.toFixed(2)}€
                </span>
              )}
            </div>
            {product.oldPrice && (
              <p className="text-promo font-semibold text-sm mb-4">
                Ahorras {(product.oldPrice - product.price).toFixed(2)}€
              </p>
            )}

            <div className="flex items-center gap-3 my-5">
              <label className="text-sm font-medium">Cantidad</label>
              <div className="flex items-center border border-border rounded">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1 hover:bg-muted">−</button>
                <span className="px-4 py-1 font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-1 hover:bg-muted">+</button>
              </div>
            </div>

            <div className="space-y-2">
              <button className="flex w-full items-center justify-center gap-2 bg-brand text-brand-foreground font-bold py-3 rounded hover:bg-brand-dark transition-colors">
                <ShoppingCart className="h-5 w-5" /> Añadir al carrito
              </button>
              <button
                onClick={handlePreview}
                className="flex w-full items-center justify-center gap-2 border-2 border-brand text-brand-dark font-bold py-3 rounded hover:bg-accent transition-colors"
              >
                <Sparkles className="h-5 w-5" /> Ver en mi patio
              </button>
              <button className="flex w-full items-center justify-center gap-2 border border-border text-foreground font-medium py-2.5 rounded hover:bg-muted transition-colors">
                <Heart className="h-4 w-4" /> Añadir a una lista
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <Benefit icon={<Truck className="h-4 w-4" />} text="Envío a domicilio en 48-72 h" />
              <Benefit icon={<Store className="h-4 w-4" />} text="Recogida gratis en tienda" />
              <Benefit icon={<Shield className="h-4 w-4" />} text="2 años de garantía" />
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">También te puede interesar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link
                key={p.id}
                to="/producto/$productId"
                params={{ productId: p.id }}
                className="block bg-card border border-border rounded-md p-3 hover:shadow-md transition-shadow"
              >
                <img src={p.image} alt={p.name} loading="lazy" width={400} height={400} className="w-full aspect-square object-contain bg-white" />
                <p className="text-sm font-medium line-clamp-2 mt-2">{p.name}</p>
                <p className="font-bold mt-1">{p.price.toFixed(2)}€</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Benefit({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="text-brand-dark">{icon}</span>
      {text}
    </div>
  );
}
