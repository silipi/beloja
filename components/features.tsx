import {
  Check,
  Smartphone,
  Share2,
  ShoppingBag,
  BarChart3,
  MessageCircle,
} from 'lucide-react'

const features = [
  {
    icon: Smartphone,
    title: 'Loja 100% mobile',
    description:
      'Sua vitrine otimizada para celular. Suas clientes navegam, adicionam ao carrinho e pedem — tudo pelo celular.',
  },
  {
    icon: Share2,
    title: 'Link único compartilhável',
    description:
      'Um link curto com seu nome. Compartilhe no WhatsApp, Instagram e TikTok e leve tráfego direto pra sua loja.',
  },
  {
    icon: ShoppingBag,
    title: 'Catálogo automático',
    description:
      'Importe produtos da Natura, Avon, Hinode e Jequiti automaticamente. Sem digitar preço por preço.',
  },
  {
    icon: MessageCircle,
    title: 'Pedido pelo WhatsApp',
    description:
      'Cada pedido chega direto no seu WhatsApp. Simples, rápido, sem sistema complicado pra aprender.',
  },
  {
    icon: BarChart3,
    title: 'Relatórios de vendas',
    description:
      'Veja quais produtos mais vendem, quais clientes compram mais e quando seu pico de vendas acontece.',
  },
  {
    icon: Check,
    title: 'Sem taxa por venda',
    description:
      'Você fica com 100% do que vender. Nenhuma comissão para a Beloja. Só uma mensalidade fixa e transparente.',
  },
]

export function Features() {
  return (
    <section
      id="funcionalidades"
      className="py-20 md:py-32 border-t border-primary/10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            • Funcionalidades
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight text-balance max-w-lg">
              Tudo que você precisa,{' '}
              <span className="italic text-primary">
                nada do que não precisa.
              </span>
            </h2>
            <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-sm">
              A Beloja foi feita escutando consultoras reais. Sem
              funcionalidades inúteis. Só o que ajuda a vender mais.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-card border border-primary/15 rounded-2xl p-8 flex flex-col gap-5 hover:border-primary/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary" aria-hidden />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-xl font-medium tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
