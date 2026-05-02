'use client';

import { Loader2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { MarcaCombobox } from '@/components/marca-combobox';
import type { WaitlistInput } from '@/lib/waitlist-schema';

interface WaitlistFormProps {
  form: UseFormReturn<WaitlistInput>;
  onSubmit: (data: WaitlistInput) => Promise<void>;
}

export function WaitlistForm({ form, onSubmit }: WaitlistFormProps) {
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Como você quer ser chamada?</FormLabel>
              <FormControl>
                <Input
                  placeholder="Maria Silva"
                  autoComplete="given-name"
                  aria-label="Como você quer ser chamada?"
                  autoFocus
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* WhatsApp */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="(99) 99999-9999"
                  placeholder="(11) 98765-4321"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-label="WhatsApp"
                  disabled={isSubmitting}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>
                É por aqui que vamos te avisar quando liberar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="maria@email.com"
                  autoComplete="email"
                  inputMode="email"
                  aria-label="E-mail"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Marca */}
        <FormField
          control={form.control}
          name="brand_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual marca você mais vende hoje?</FormLabel>
              <FormDescription className="-mt-1">
                Pode escolher da lista ou digitar a sua
              </FormDescription>
              <FormControl>
                <MarcaCombobox
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    field.onBlur();
                  }}
                  error={!!form.formState.errors.brand_name}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-accent px-8 py-6 text-base font-medium h-auto mt-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Garantir minha vaga'
          )}
        </Button>
      </form>
    </Form>
  );
}
