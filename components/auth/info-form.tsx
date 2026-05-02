'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MaskedInput } from '@/components/ui/masked-input';
import { salvarInfoConsultora } from '@/lib/actions/consultora';

export function InfoForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [slug, setSlug] = useState('');

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await salvarInfoConsultora(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="nome">Seu nome</Label>
        <Input
          id="nome"
          name="nome"
          required
          minLength={2}
          maxLength={60}
          placeholder="Maria Silva"
          className="h-12"
          disabled={isPending}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone (com DDD)</Label>
        <MaskedInput
          id="telefone"
          name="telefone"
          mask="(99) 99999-9999"
          required
          placeholder="(11) 98765-4321"
          inputMode="numeric"
          className="h-12"
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Você poderá usar esse número pra fazer login também.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Link da sua loja</Label>
        <div className="flex items-center rounded-lg border border-input bg-transparent focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <span className="px-3 font-mono text-sm text-muted-foreground select-none">
            beloja.com.br/
          </span>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
            }
            placeholder="maria"
            className="h-12 border-0 bg-transparent pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isPending}
          />
        </div>
      </div>

      <Button type="submit" className="h-12 w-full" disabled={isPending}>
        {isPending ? 'Salvando...' : 'Continuar'}
      </Button>
      {error && <p className="text-center text-sm text-destructive">{error}</p>}
    </form>
  );
}
