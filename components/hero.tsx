import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
      {/* Subtle gold radial glow top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.06]"
        style={{
          background:
            'radial-gradient(circle at 70% 20%, #D4AF37 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20 md:py-32">
          {/* Left column — copy */}
          <div className="flex flex-col gap-8">
            {/* Eyebrow */}
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              • Para consultoras de beleza
            </p>

            {/* Headline */}
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.92] text-balance">
              Sua loja.{' '}
              <span className="italic text-primary">Sua vitrine.</span> Seus
              clientes.
            </h1>

            {/* Sub-headline */}
            <p className="font-sans text-lg leading-relaxed text-muted-foreground max-w-lg">
              A loja digital feita pra quem revende Natura, Avon, Hinode e
              Jequiti. Sem CNPJ. Sem complicação. Em 5 minutos no ar.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
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

            {/* Trust signal */}
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Grátis para sempre no plano básico · Sem cartão de crédito
            </p>
          </div>

          {/* Right column — phone mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative gold ring behind phone */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-full opacity-10 blur-3xl"
                style={{ background: '#D4AF37', transform: 'scale(0.8)' }}
              />
              <Image
                src="/phone-mockup.jpg"
                alt="Prévia de uma loja Beloja no celular mostrando produtos de beleza"
                width={420}
                height={560}
                className="relative z-10 rounded-3xl shadow-2xl shadow-black/60 w-full max-w-[340px] lg:max-w-[420px] object-cover"
                priority
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 z-20 bg-card border border-primary/20 rounded-2xl px-5 py-3 flex items-center gap-3">
                <span className="font-display text-3xl font-light text-primary leading-none">
                  +1M
                </span>
                <span className="font-sans text-xs text-muted-foreground leading-tight max-w-[80px]">
                  consultoras no Brasil
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics bar */}
        <div className="border-t border-primary/10 pt-10 pb-20">
          <dl className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-16">
            {[
              { value: '+1M', label: 'consultoras no Brasil' },
              { value: '5 min', label: 'para criar sua loja' },
              { value: 'R$ 0', label: 'para começar' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-4">
                <dt className="font-display text-4xl font-light text-primary leading-none">
                  {stat.value}
                </dt>
                <dd className="font-sans text-sm text-muted-foreground leading-tight max-w-[100px]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
