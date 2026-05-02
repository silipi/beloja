import Link from 'next/link';

const links: Record<string, { label: string; href: string }[]> = {
  Produto: [
    { label: 'Funcionalidades', href: '/#funcionalidades' },
    { label: 'Preços', href: '/#precos' },
    { label: 'Blog', href: '/blog' },
    { label: 'Roadmap', href: '#' },
  ],
  Suporte: [
    { label: 'Central de ajuda', href: '#' },
    { label: 'WhatsApp', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'Contato', href: '#' },
  ],
  Empresa: [
    { label: 'Sobre nós', href: '#' },
    { label: 'Blog', href: '/blog' },
    { label: 'Carreiras', href: '#' },
    { label: 'Imprensa', href: '#' },
  ],
  Legal: [
    { label: 'Termos de uso', href: '#' },
    { label: 'Privacidade', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-primary/10 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" aria-label="Beloja — página inicial">
              <span className="font-display text-2xl tracking-tight font-normal leading-none">
                B<span className="italic font-light text-primary">e</span>loja
              </span>
            </Link>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              A vitrine digital das consultoras brasileiras.
            </p>
          </div>

          {/* Nav columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                {category}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            &copy; {new Date().getFullYear()} Beloja. Feito com amor no Brasil.
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Parceiros:
            </span>
            {['Natura', 'Avon', 'Hinode', 'Jequiti'].map((brand) => (
              <span
                key={brand}
                className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60 border border-primary/10 rounded px-2 py-0.5"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
