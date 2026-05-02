import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" aria-label="Beloja — página inicial">
          <span className="font-display text-2xl tracking-tight font-normal leading-none select-none">
            B<span className="italic font-light text-primary">e</span>loja
          </span>
        </Link>

        {/* Nav links */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Navegação principal"
        >
          <Link
            href="#funcionalidades"
            className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Funcionalidades
          </Link>
          <Link
            href="#precos"
            className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Preços
          </Link>
          <Link
            href="#depoimentos"
            className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Depoimentos
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/app/entrar"
            className="hidden md:block font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Entrar
          </Link>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-accent rounded-lg px-5 py-2 font-sans font-medium text-sm transition-colors"
          >
            <Link href="/app/registrar">Criar minha loja</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
