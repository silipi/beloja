import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { getAllPosts, type PostMeta } from '@/lib/blog';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function BlogCard({ post }: { post: PostMeta }) {
  const href = `/blog/${post.slug.join('/')}`;

  return (
    <Link
      href={href}
      className="group bg-card border border-primary/15 rounded-2xl p-8 flex flex-col gap-5 hover:border-primary/40 transition-colors"
    >
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary bg-primary/8 border border-primary/15 rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title + description */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-display text-xl font-medium tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        {post.description && (
          <p className="font-sans text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.description}
          </p>
        )}
      </div>

      {/* Footer: date + reading time + arrow */}
      <div className="flex items-center justify-between pt-2 border-t border-primary/10">
        <div className="flex items-center gap-4">
          <time
            dateTime={post.date}
            className="font-mono text-xs text-muted-foreground"
          >
            {formatDate(post.date)}
          </time>
          <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <Clock size={11} aria-hidden />
            {post.readingTime} min
          </span>
        </div>
        <ArrowRight
          size={16}
          className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
          aria-hidden
        />
      </div>
    </Link>
  );
}

export async function BlogPreview() {
  const posts = (await getAllPosts()).slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-32 border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            • Blog
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight text-balance max-w-lg">
              Dicas para vender{' '}
              <span className="italic text-primary">mais e melhor.</span>
            </h2>
            <Link
              href="/blog"
              className="group flex items-center gap-2 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors self-start md:self-auto shrink-0"
            >
              Ver todos os artigos
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden
              />
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug.join('/')} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
