import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/app/entrar');
  }

  const { data: consultora } = await supabase
    .from('consultoras')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!consultora) {
    redirect('/app/registrar/info');
  }

  return (
    <main className="px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-12">
        <section className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            • Olá, {consultora.nome.split(' ')[0]}
          </p>
          <h1 className="font-display text-5xl font-light tracking-tight">
            Sua loja está <span className="italic text-primary">no ar</span>.
          </h1>
          <p className="text-muted-foreground">
            Compartilhe seu link:{' '}
            <span className="font-mono text-foreground">
              beloja.com.br/{consultora.slug}
            </span>
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Sua conta
          </p>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Nome</dt>
              <dd className="font-medium">{consultora.nome}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{consultora.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Telefone</dt>
              <dd className="font-mono">{consultora.telefone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Link da loja</dt>
              <dd className="font-mono text-primary">/{consultora.slug}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-dashed border-border p-6 text-center space-y-2">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Próximo passo
          </p>
          <p className="font-display text-2xl font-light">
            Adicionar suas{' '}
            <span className="italic text-primary">marcas e produtos</span>
          </p>
          <p className="text-sm text-muted-foreground">Em breve aqui.</p>
        </section>

        <form action={signOut} className="flex justify-center">
          <Button type="submit" variant="ghost">
            Sair
          </Button>
        </form>
      </div>
    </main>
  );
}
