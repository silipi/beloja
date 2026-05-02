import { z } from 'zod';

export const waitlistSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Número de celular inválido'),
  email: z.string().email('E-mail inválido'),
  brand_name: z.string().min(1, 'Selecione uma marca'),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
