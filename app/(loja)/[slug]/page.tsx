import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function LojaPublicaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: consultora } = await supabase
    .from('consultoras')
    .select('nome, slug, bio, foto_url')
    .eq('slug', slug)
    .maybeSingle();

  if (!consultora) {
    notFound();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="text-center space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          • Loja em construção
        </p>
        <h1 className="font-display text-5xl font-light tracking-tight">
          A loja da{' '}
          <span className="italic text-primary">
            {consultora.nome.split(' ')[0]}
          </span>
        </h1>
        <p className="text-muted-foreground">
          Em breve, todos os produtos aqui.
        </p>
      </div>
    </main>
  );
}
