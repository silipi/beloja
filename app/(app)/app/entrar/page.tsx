import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from '@/components/auth/login-form';

export default async function EntrarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/app/dashboard');
  }

  return (
    <main className="flex min-h-[calc(100vh-65px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            • Bem-vinda de volta
          </p>
          <h1 className="font-display text-4xl font-light tracking-tight">
            Entrar na <span className="italic text-primary">Beloja</span>
          </h1>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{' '}
          <Link href="/app/registrar" className="text-primary hover:underline">
            Criar agora
          </Link>
        </p>
      </div>
    </main>
  );
}
