import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getAllPosts } from '@/lib/blog'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Blog — Beloja',
  description:
    'Dicas, novidades e histórias para consultoras de beleza que usam a Beloja para vender mais.',
  openGraph: {
    title: 'Blog — Beloja',
    description:
      'Dicas, novidades e histórias para consultoras de beleza que usam a Beloja para vender mais.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Blog — Beloja',
    description:
      'Dicas, novidades e histórias para consultoras de beleza que usam a Beloja para vender mais.',
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Page header */}
        <section className="py-20 md:py-32 border-b border-primary/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
              • Blog
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight text-balance max-w-2xl leading-[0.95] mb-6">
              Novidades e <span className="italic text-primary">dicas</span>{' '}
              para sua loja.
            </h1>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-lg">
              Conteúdo para consultoras que querem vender mais, organizar melhor
              e crescer com a Beloja.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            {posts.length === 0 ? (
              <p className="font-sans text-muted-foreground">
                Nenhum post publicado ainda.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                  const href = `/blog/${post.slug.join('/')}`
                  return (
                    <article
                      key={href}
                      className="relative bg-card border border-primary/15 rounded-2xl overflow-hidden hover:border-primary/40 transition-colors group flex flex-col"
                    >
                      {post.cover && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.cover}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      <div className="p-8 flex flex-col gap-4 flex-1">
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="font-mono text-[10px] uppercase tracking-wider text-primary border border-primary/20 rounded px-2 py-0.5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <h2 className="font-display text-xl font-light tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
                          <Link
                            href={href}
                            className="after:absolute after:inset-0"
                          >
                            {post.title}
                          </Link>
                        </h2>

                        {post.description && (
                          <p className="font-sans text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                            {post.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-primary/10 mt-auto">
                          <time
                            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                            dateTime={post.date}
                          >
                            {format(new Date(post.date), 'd MMM yyyy', {
                              locale: ptBR,
                            })}
                          </time>
                          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                            {post.readingTime} min
                          </span>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
