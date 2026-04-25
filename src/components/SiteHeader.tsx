import { Link } from "@tanstack/react-router";
import { Search, HelpCircle, User, Heart, ShoppingCart, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [promoOpen, setPromoOpen] = useState(true);

  return (
    <header className="border-b border-border bg-background">
      {promoOpen && (
        <div className="bg-[oklch(0.92_0.05_27)] text-[oklch(0.35_0.15_27)] text-sm">
          <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-3 px-4 py-2 relative">
            <span className="text-center">
              <strong>¡Ofertas hasta -25% para recibir al verano!</strong> Compra online, en tiendas o 910 49 99 99{" "}
              <Link to="/ofertas" className="underline font-semibold">Ver ofertas</Link>
            </span>
            <button
              onClick={() => setPromoOpen(false)}
              className="absolute right-4 hover:opacity-70"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-12 w-16 items-center justify-center bg-brand text-brand-foreground font-black text-xs leading-tight rounded-sm">
            <span className="text-center">LEROY<br/>MERLIN</span>
          </div>
        </Link>

        <button className="hidden lg:flex items-center gap-2 text-sm shrink-0 hover:text-brand">
          <MapPin className="h-5 w-5" />
          <span className="font-medium">Urban Barcelona</span>
        </button>

        <div className="flex-1 max-w-2xl mx-2">
          <div className="relative">
            <input
              type="text"
              placeholder="¿ Qué estás buscando ?"
              className="w-full rounded-full border border-border bg-background py-2.5 pl-5 pr-12 text-sm outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-muted">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5 text-xs">
          <button className="flex flex-col items-center gap-1 hover:text-brand">
            <HelpCircle className="h-5 w-5" />
            <span>Ayuda y contacto</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-brand">
            <User className="h-5 w-5" />
            <span>Iniciar sesión</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-brand">
            <Heart className="h-5 w-5" />
            <span>Listas</span>
          </button>
          <Link to="/cart" className="flex flex-col items-center gap-1 hover:text-brand">
            <ShoppingCart className="h-5 w-5" />
            <span>Mi carrito</span>
          </Link>
        </div>
      </div>

      <nav className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] items-center gap-1 px-4 overflow-x-auto">
          <button className="flex items-center gap-2 px-3 py-3 text-sm font-medium hover:text-brand whitespace-nowrap">
            <Menu className="h-4 w-4" /> Productos
          </button>
          <NavLink to="/productos">Proyectos</NavLink>
          <NavLink to="/productos">A medida</NavLink>
          <NavLink to="/productos">Inspiración</NavLink>
          <NavLink to="/productos">Servicios</NavLink>
          <span className="px-3 py-3 text-sm font-medium text-promo whitespace-nowrap">Ofertas y folletos</span>
          <NavLink to="/productos">Ahorra energía</NavLink>
          <Link
            to="/patio-designer"
            activeProps={{ className: "text-brand font-semibold border-b-2 border-brand" }}
            className="px-3 py-3 text-sm font-semibold whitespace-nowrap text-brand-dark hover:text-brand"
          >
            🌿 Patio Designer
          </Link>
          <div className="ml-auto flex items-center">
            <NavLink to="/productos">Club Leroy Merlin</NavLink>
            <NavLink to="/productos">Comunidad</NavLink>
            <NavLink to="/productos">Tiendas</NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-3 py-3 text-sm font-medium hover:text-brand whitespace-nowrap"
    >
      {children}
    </Link>
  );
}
