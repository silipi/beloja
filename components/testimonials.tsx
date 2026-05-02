const testimonials = [
  {
    quote:
      'Em 5 minutos tinha minha loja no ar. Mandei o link pras clientes e já vendi no mesmo dia.',
    author: 'Camila Rodrigues',
    role: 'Consultora Natura · São Paulo',
    initials: 'CR',
  },
  {
    quote:
      'Nunca imaginei ter uma loja tão bonita. As clientes acham que é de loja de shopping, mas sou eu mesma vendendo.',
    author: 'Fernanda Lima',
    role: 'Revendedora Avon · Belo Horizonte',
    initials: 'FL',
  },
  {
    quote:
      'Antes eu mandava foto no WhatsApp. Agora mando o link da minha loja. A diferença é absurda.',
    author: 'Juliana Souza',
    role: 'Consultora Hinode · Fortaleza',
    initials: 'JS',
  },
]

export function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="py-20 md:py-32 border-t border-primary/10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            • Depoimentos reais
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight text-balance max-w-xl">
            Quem usa a Beloja{' '}
            <span className="italic text-primary">não volta atrás.</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="bg-card border border-primary/15 rounded-2xl p-8 flex flex-col gap-6 hover:border-primary/40 transition-colors"
            >
              {/* Quote marks */}
              <span
                aria-hidden
                className="font-display text-5xl font-light text-primary leading-none select-none"
              >
                &ldquo;
              </span>
              <blockquote className="font-sans text-base leading-relaxed text-foreground flex-1">
                {t.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-primary/10 pt-6">
                {/* Avatar initials */}
                <div
                  className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0"
                  aria-hidden
                >
                  <span className="font-mono text-xs text-primary font-medium">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-foreground">
                    {t.author}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
