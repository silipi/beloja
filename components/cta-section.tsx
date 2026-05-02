import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className="py-20 md:py-32 border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-card border border-primary/20 rounded-2xl p-12 md:p-20 flex flex-col items-center text-center gap-8 relative overflow-hidden">
          {/* Background accent */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] opacity-[0.04]"
            style={{
              background:
                'radial-gradient(ellipse, #D4AF37 0%, transparent 70%)',
            }}
          />

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary relative z-10">
            • Comece hoje
          </p>

          <h2 className="font-display text-4xl md:text-6xl font-light tracking-tight text-balance max-w-2xl relative z-10 leading-[0.95]">
            Sua loja pronta antes de{' '}
            <span className="italic text-primary">você dormir hoje.</span>
          </h2>

          <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-lg relative z-10">
            Mais de 1 milhão de consultoras brasileiras já estão vendendo online
            com a Beloja. Crie sua loja agora — é de graça.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <Button className="bg-primary text-primary-foreground hover:bg-accent rounded-lg px-8 py-4 font-sans font-medium text-base h-auto transition-colors">
              Criar minha loja grátis
            </Button>
            <Button
              variant="outline"
              className="border-border hover:bg-secondary rounded-lg px-8 py-4 font-sans font-medium text-base h-auto transition-colors"
            >
              Ver como funciona
            </Button>
          </div>

          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider relative z-10">
            Sem cartão de crédito · Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
}
