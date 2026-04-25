import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, ShoppingCart, Sparkles, Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { designerStore } from "@/lib/designer-store";

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const discount =
    product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const handlePreview = () => {
    designerStore.addProduct(product.id, 1);
    navigate({ to: "/patio-designer" });
  };

  return (
    <div className="group relative flex flex-col rounded-md border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      {discount > 0 && (
        <span className="absolute left-2 top-2 z-10 bg-promo text-promo-foreground text-xs font-bold px-2 py-1 rounded">
          -{discount}%
        </span>
      )}
      <button className="absolute right-2 top-2 z-10 p-1.5 bg-background/80 rounded-full hover:bg-background">
        <Heart className="h-4 w-4" />
      </button>

      <Link
        to="/producto/$productId"
        params={{ productId: product.id }}
        className="block aspect-square bg-white p-4"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={400}
          height={400}
          className="h-full w-full object-contain group-hover:scale-105 transition-transform"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <Link
          to="/producto/$productId"
          params={{ productId: product.id }}
          className="text-sm font-medium leading-snug line-clamp-2 hover:text-brand min-h-[40px]"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-xl font-bold">{product.price.toFixed(2)}€</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {product.oldPrice.toFixed(2)}€
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <button className="flex items-center justify-center gap-2 bg-brand text-brand-foreground text-sm font-semibold py-2 rounded hover:bg-brand-dark transition-colors">
            <ShoppingCart className="h-4 w-4" /> Añadir al carrito
          </button>
          <button
            onClick={handlePreview}
            className="flex items-center justify-center gap-2 border border-brand text-brand-dark text-sm font-semibold py-2 rounded hover:bg-accent transition-colors"
          >
            <Sparkles className="h-4 w-4" /> Ver en mi patio
          </button>
        </div>
      </div>
    </div>
  );
}
