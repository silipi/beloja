'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { WaitlistDialog } from '@/components/waitlist-dialog';

export function WaitlistCTA() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary-hover px-8 py-4 text-base font-medium h-auto transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
          onClick={() => setOpen(true)}
        >
          <span
            aria-hidden
            className="mr-2 size-2 shrink-0 rounded-full bg-primary-foreground/50 animate-pulse"
          />
          Entrar na fila de espera
        </Button>

        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          • Acesso Antecipado • Sem Cartão
        </p>
      </div>

      <WaitlistDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
