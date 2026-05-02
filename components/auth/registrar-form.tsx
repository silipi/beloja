'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerWithEmail, loginWithGoogle } from '@/lib/actions/auth';
import { GoogleButton } from './google-button';
import { Divider } from './divider';

export function RegistrarForm() {
  const [error, setError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await registerWithEmail(formData);
      if (result?.error) {
        setError(result.error);
      }
      if (result?.needsEmailConfirmation) {
        setNeedsConfirm(true);
      }
    });
  }

  if (needsConfirm) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center space-y-2">
        <p className="font-display text-2xl font-light">
          Confira seu <span className="italic text-primary">email</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Enviamos um link de confirmação. Abra-o pra ativar sua conta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleButton
        onClick={() =>
          startTransition(() => {
            void loginWithGoogle();
          })
        }
        disabled={isPending}
      />
      <Divider>ou</Divider>
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            placeholder="seu@email.com"
            className="h-12"
            autoComplete="email"
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            className="h-12"
            autoComplete="new-password"
            disabled={isPending}
          />
        </div>
        <Button type="submit" className="h-12 w-full" disabled={isPending}>
          {isPending ? 'Criando conta...' : 'Criar conta'}
        </Button>
        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}
      </form>
    </div>
  );
}
