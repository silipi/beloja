'use client';

import * as React from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useIsMobile } from '@/components/ui/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { WaitlistForm } from '@/components/waitlist-form';
import { waitlistSchema, type WaitlistInput } from '@/lib/waitlist-schema';
import { joinWaitlist } from '@/app/actions/waitlist';

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DialogHeaderContent() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        • Acesso Antecipado
      </p>
      <DialogTitle className="font-display text-2xl font-light tracking-tight leading-tight">
        Sua loja, em{' '}
        <span className="italic text-primary">primeiro lugar.</span>
      </DialogTitle>
      <DialogDescription>
        Inscreva-se na fila e seja uma das primeiras consultoras a usar a
        Beloja. Sem custo, sem compromisso.
      </DialogDescription>
    </>
  );
}

function DrawerHeaderContent() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        • Acesso Antecipado
      </p>
      <DrawerTitle className="font-display text-2xl font-light tracking-tight leading-tight">
        Sua loja, em{' '}
        <span className="italic text-primary">primeiro lugar.</span>
      </DrawerTitle>
      <DrawerDescription>
        Inscreva-se na fila e seja uma das primeiras consultoras a usar a
        Beloja. Sem custo, sem compromisso.
      </DrawerDescription>
    </>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
        <CheckCircle2 className="size-10 text-primary" />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">
          • Você está dentro
        </p>
        <h2 className="font-display text-2xl font-light tracking-tight">
          Bem-vinda à <span className="italic text-primary">fila.</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Te avisamos no WhatsApp assim que liberarmos seu acesso. Enquanto
          isso, segue a gente no Instagram.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="flex-1"
          asChild
        >
          <a
            href="https://instagram.com/beloja"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 size-4" />
            Seguir no Instagram
          </a>
        </Button>
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}

export function WaitlistDialog({ open, onOpenChange }: WaitlistDialogProps) {
  const isMobile = useIsMobile();
  const [success, setSuccess] = React.useState(false);

  const form = useForm<WaitlistInput>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      brand_name: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function handleSubmit(data: WaitlistInput) {
    try {
      await joinWaitlist(data);
      setSuccess(true);
    } catch {
      toast.error('Algo deu errado. Tenta de novo em uns segundos.');
    }
  }

  function handleClose() {
    onOpenChange(false);
    // Reset success state after close animation completes
    setTimeout(() => setSuccess(false), 300);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) {
      return;
    }
    if (!nextOpen) {
      setTimeout(() => setSuccess(false), 300);
    }
    onOpenChange(nextOpen);
  }

  const content = success ? (
    <SuccessView onClose={handleClose} />
  ) : (
    <WaitlistForm form={form} onSubmit={handleSubmit} />
  );

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={handleOpenChange}
        dismissible={!isSubmitting}
      >
        <DrawerContent className="px-0">
          <div className="overflow-y-auto pb-8">
            <DrawerHeader className="px-6 pb-4 pt-2 text-left">
              <DrawerHeaderContent />
            </DrawerHeader>
            <div className="px-6">{content}</div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="gap-2">
          <DialogHeaderContent />
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
