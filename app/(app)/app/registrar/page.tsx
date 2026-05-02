import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { RegistrarForm } from '@/components/auth/registrar-form';

export default async function RegistrarPage() {
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
            • Crie sua loja
          </p>
          <h1 className="font-display text-4xl font-light tracking-tight">
            Começar na <span className="italic text-primary">Beloja</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Sua loja digital em poucos minutos.
          </p>
        </div>
        <RegistrarForm />
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{' '}
          <Link href="/app/entrar" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
