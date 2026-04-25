export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/40">
      <div className="mx-auto max-w-[1400px] px-4 py-10 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="flex h-12 w-16 items-center justify-center bg-brand text-brand-foreground font-black text-xs leading-tight rounded-sm mb-3">
            <span className="text-center">LEROY<br/>MERLIN</span>
          </div>
          <p className="text-muted-foreground">La forma más fácil de transformar tu hogar.</p>
        </div>
        <FooterCol title="Comprar" items={["Productos", "Ofertas", "A medida", "Patio Designer"]} />
        <FooterCol title="Ayuda" items={["Contacto", "Envíos", "Devoluciones", "Tiendas"]} />
        <FooterCol title="Empresa" items={["Sobre nosotros", "Trabaja con nosotros", "Sostenibilidad"]} />
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Leroy Merlin España — Demo
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-muted-foreground">
        {items.map((i) => <li key={i} className="hover:text-foreground cursor-pointer">{i}</li>)}
      </ul>
    </div>
  );
}
