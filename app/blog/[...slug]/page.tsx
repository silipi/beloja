import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft } from 'lucide-react'
import { getAllPosts, getPost } from '@/lib/blog'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) return { title: 'Post não encontrado — Blog Beloja' }

  const url = `https://beloja.com.br/blog/${slug.join('/')}`

  return {
    title: `${post.title} — Blog Beloja`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      ...(post.author && { authors: [post.author] }),
      ...(post.cover && { images: [{ url: post.cover, alt: post.title }] }),
    },
    twitter: {
      card: post.cover ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.description,
      ...(post.cover && { images: [post.cover] }),
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const formattedDate = format(new Date(post.date), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    ...(post.author && { author: { '@type': 'Person', name: post.author } }),
    ...(post.cover && { image: post.cover }),
    publisher: {
      '@type': 'Organization',
      name: 'Beloja',
      url: 'https://beloja.com.br',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen pt-16">
        <article>
          {/* Post header */}
          <header className="py-20 md:py-32 border-b border-primary/10">
            <div className="max-w-3xl mx-auto px-6 md:px-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-12"
              >
                <ArrowLeft size={14} aria-hidden />
                Blog
              </Link>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
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

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[0.95] text-balance mb-10">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-5">
                {post.author && (
                  <span className="font-sans text-sm text-foreground">
                    {post.author}
                  </span>
                )}
                <time
                  dateTime={post.date}
                  className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                >
                  {formattedDate}
                </time>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {post.readingTime} min de leitura
                </span>
              </div>
            </div>
          </header>

          {/* Cover image */}
          {post.cover && (
            <div className="max-w-5xl mx-auto px-6 md:px-12 pt-10">
              <img
                src={post.cover}
                alt={post.title}
                className="w-full rounded-2xl object-cover aspect-video"
              />
            </div>
          )}

          {/* Article body */}
          <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Back link */}
          <div className="max-w-3xl mx-auto px-6 md:px-12 pb-24 border-t border-primary/10 pt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} aria-hidden />
              Voltar ao blog
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
