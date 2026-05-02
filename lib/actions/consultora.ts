'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const infoSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(60, 'Nome muito longo'),
  phone: z
    .string()
    .transform((v) => v.replace(/[^0-9]/g, ''))
    .pipe(
      z
        .string()
        .regex(
          /^[0-9]{10,15}$/,
          'Telefone inválido (inclua DDD, somente números)',
        ),
    ),
  slug: z
    .string()
    .toLowerCase()
    .regex(
      /^[a-z0-9][a-z0-9-]{2,30}[a-z0-9]$/,
      'Use apenas letras minúsculas, números e hífen (4-32 caracteres, sem hífen no início ou fim)',
    ),
});

export async function salvarInfoConsultora(formData: FormData) {
  const parsed = infoSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    slug: formData.get('slug'),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Dados inválidos' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return { error: 'Sessão expirada. Faça login novamente.' };
  }

  // If a profile already exists, send the consultant straight to the dashboard.
  const { data: existing } = await supabase
    .from('consultants')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (existing) {
    redirect('/app/dashboard');
  }

  // Check slug availability.
  const { data: slugOk } = await supabase.rpc('is_slug_available', {
    p_slug: parsed.data.slug,
  });
  if (!slugOk) {
    return { error: 'Esse link de loja não está disponível. Tenta outro.' };
  }

  // Check phone uniqueness.
  const { data: phoneTaken } = await supabase
    .from('consultants')
    .select('id')
    .eq('phone', parsed.data.phone)
    .maybeSingle();
  if (phoneTaken) {
    return { error: 'Esse telefone já tem cadastro.' };
  }

  const { error } = await supabase.from('consultants').insert({
    user_id: user.id,
    email: user.email,
    name: parsed.data.name,
    phone: parsed.data.phone,
    slug: parsed.data.slug,
  });

  if (error) {
    console.error('[consultant] insert error:', error);
    return { error: 'Erro ao salvar. Tenta de novo?' };
  }

  revalidatePath('/app/dashboard');
  redirect('/app/dashboard');
}
