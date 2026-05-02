'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { registerWithEmail, loginWithGoogle } from '@/lib/actions/auth';
import { GoogleButton } from './google-button';
import { Divider } from './divider';

const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu email')
    .email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegistrarForm() {
  const [error, setError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function handleSubmit(values: RegisterFormValues) {
    setError(null);

    const formData = new FormData();
    formData.set('email', values.email);
    formData.set('password', values.password);

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="h-12"
                    autoComplete="email"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    className="h-12"
                    autoComplete="new-password"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="h-12 w-full" disabled={isPending}>
            {isPending ? 'Criando conta...' : 'Criar conta'}
          </Button>
          {error && (
            <p className="text-center text-sm text-destructive">{error}</p>
          )}
        </form>
      </Form>
    </div>
  );
}
