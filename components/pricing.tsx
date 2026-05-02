import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: 'para sempre',
    description: 'Para quem quer experimentar e dar os primeiros passos.',
    features: [
      'Loja com até 20 produtos',
      'Link compartilhável',
      'Pedidos por WhatsApp',
      'Subdomínio Beloja',
    ],
    cta: 'Criar grátis',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'R$ 29',
    period: 'por mês',
    description: 'Para a consultora que quer profissionalizar e vender mais.',
    features: [
      'Produtos ilimitados',
      'Domínio próprio',
      'Relatórios de vendas',
      'Importação automática de catálogo',
      'Suporte prioritário',
      'Sem taxa por venda',
    ],
    cta: 'Começar grátis por 14 dias',
    highlighted: true,
  },
  {
    name: 'Time',
    price: 'R$ 79',
    period: 'por mês',
    description: 'Para líderes de equipe com múltiplas consultoras.',
    features: [
      'Tudo do plano Pro',
      'Até 5 lojas em uma conta',
      'Painel unificado de pedidos',
      'Relatórios por consultora',
      'Gerente de conta dedicado',
    ],
    cta: 'Falar com a equipe',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="precos" className="py-20 md:py-32 border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16 text-center items-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            • Preços
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight text-balance max-w-xl">
            Simples, transparente,{' '}
            <span className="italic text-primary">sem surpresa.</span>
          </h2>
          <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-md">
            Comece de graça. Evolua quando quiser. Sem contrato anual, sem
            fidelidade forçada.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlighted
                  ? 'bg-card border-2 border-primary rounded-2xl p-8 flex flex-col gap-8 relative'
                  : 'bg-card border border-primary/15 rounded-2xl p-8 flex flex-col gap-8 hover:border-primary/40 transition-colors'
              }
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider px-4 py-1.5 rounded-full">
                    Mais popular
                  </span>
                </div>
              )}

              {/* Plan name + price */}
              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {plan.name}
                </p>
                <div className="flex items-end gap-2">
                  <span className="font-display text-5xl font-light text-primary leading-none">
                    {plan.price}
                  </span>
                  <span className="font-sans text-sm text-muted-foreground mb-1">
                    {plan.period}
                  </span>
                </div>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul
                className="flex flex-col gap-3 flex-1"
                aria-label={`Recursos do plano ${plan.name}`}
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={16}
                      className="text-primary mt-0.5 flex-shrink-0"
                      aria-hidden
                    />
                    <span className="font-sans text-sm text-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                className={
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-accent rounded-lg px-6 py-3 font-sans font-medium h-auto transition-colors w-full'
                    : 'border border-border hover:bg-secondary text-foreground rounded-lg px-6 py-3 font-sans font-medium h-auto transition-colors w-full bg-transparent'
                }
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
