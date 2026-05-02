'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  loginWithEmail,
  loginWithPhone,
  loginWithGoogle,
} from '@/lib/actions/auth'
import { GoogleButton } from './google-button'
import { Divider } from './divider'

type Method = 'email' | 'telefone'

export function LoginForm() {
  const [method, setMethod] = useState<Method>('email')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const action = method === 'email' ? loginWithEmail : loginWithPhone
      const result = await action(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="space-y-5">
      <GoogleButton
        onClick={() =>
          startTransition(() => {
            void loginWithGoogle()
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
          onClick={() => setMethod('telefone')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            method === 'telefone'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Telefone
        </button>
      </div>

      <form action={handleSubmit} className="space-y-4" key={method}>
        {method === 'email' ? (
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
              autoFocus
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              name="telefone"
              required
              placeholder="11987654321"
              inputMode="numeric"
              className="h-12"
              autoComplete="tel"
              disabled={isPending}
              autoFocus
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            placeholder="Sua senha"
            className="h-12"
            autoComplete="current-password"
            disabled={isPending}
          />
        </div>

        <Button type="submit" className="h-12 w-full" disabled={isPending}>
          {isPending ? 'Entrando...' : 'Entrar'}
        </Button>
        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}
      </form>
    </div>
  )
}
