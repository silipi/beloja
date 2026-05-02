import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InfoForm } from '@/components/auth/info-form';

export default async function InfoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/app/registrar');
  }

  const { data: consultant } = await supabase
    .from('consultants')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (consultant) {
    redirect('/app/dashboard');
  }

  return (
    <main className="flex min-h-[calc(100vh-65px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            • Quase lá
          </p>
          <h1 className="font-display text-4xl font-light tracking-tight">
            Algumas <span className="italic text-primary">informações</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Pra montar sua loja com a sua cara.
          </p>
        </div>
        <InfoForm />
      </div>
    </main>
  );
}
