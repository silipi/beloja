'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
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
import { MaskedInput } from '@/components/ui/masked-input';
import {
  loginWithEmail,
  loginWithPhone,
  loginWithGoogle,
} from '@/lib/actions/auth';
import { GoogleButton } from './google-button';
import { Divider } from './divider';

type Method = 'email' | 'phone';

const loginSchema = z
  .object({
    method: z.enum(['email', 'phone']),
    email: z.string().trim(),
    phone: z.string(),
    password: z.string().min(1, 'Informe sua senha'),
  })
  .superRefine((values, ctx) => {
    if (values.method === 'email') {
      const parsedEmail = z
        .string()
        .min(1, 'Informe seu email')
        .email('Email inválido')
        .safeParse(values.email);

      if (!parsedEmail.success) {
        ctx.addIssue({
          ...parsedEmail.error.issues[0],
          path: ['email'],
        });
      }
    }

    if (values.method === 'phone') {
      const phoneDigits = values.phone.replace(/\D/g, '');

      if (!phoneDigits) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: 'Informe seu telefone',
        });
      } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: 'Telefone inválido',
        });
      }
    }
  });

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      method: 'email',
      email: '',
      phone: '',
      password: '',
    },
  });
  const method = useWatch({ control: form.control, name: 'method' });

  function setMethod(method: Method) {
    form.setValue('method', method);
    form.clearErrors();
    setError(null);
  }

  function handleSubmit(values: LoginFormValues) {
    setError(null);

    const formData = new FormData();
    formData.set('password', values.password);
    formData.set(values.method, values[values.method]);

    startTransition(async () => {
      const action = values.method === 'email' ? loginWithEmail : loginWithPhone;
      const result = await action(formData);

      if (result?.error) {
        setError(result.error);
      }
    });
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

      <div className="flex rounded-lg border border-border p-1">
        <button
          type="button"
          onClick={() => setMethod('email')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            method === 'email'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setMethod('phone')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            method === 'phone'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Telefone
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {method === 'email' ? (
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
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <MaskedInput
                      mask="(99) 99999-9999"
                      placeholder="(11) 98765-4321"
                      inputMode="numeric"
                      className="h-12"
                      autoComplete="tel"
                      disabled={isPending}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Sua senha"
                    className="h-12"
                    autoComplete="current-password"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="h-12 w-full" disabled={isPending}>
            {isPending ? 'Entrando...' : 'Entrar'}
          </Button>
          {error && (
            <p className="text-center text-sm text-destructive">{error}</p>
          )}
        </form>
      </Form>
    </div>
  );
}
