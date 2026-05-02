'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

const loginEmailSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(1, 'Senha obrigatória'),
});

const loginPhoneSchema = z.object({
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, 'Telefone inválido (somente números, com DDD)'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export async function registerWithEmail(formData: FormData) {
  const parsed = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Dados inválidos' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/app/registrar/info`,
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Esse email já tem cadastro. Tenta fazer login.' };
    }
    console.error('[auth] register error:', error);
    return { error: 'Erro ao criar conta. Tenta de novo?' };
  }

  // If Supabase does not require email confirmation, the session already exists.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect('/app/registrar/info');
  }

  return { success: true, needsEmailConfirmation: true };
}

export async function loginWithEmail(formData: FormData) {
  const parsed = loginEmailSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Dados inválidos' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    return { error: 'Email ou senha incorretos' };
  }

  redirect('/app/dashboard');
}

export async function loginWithPhone(formData: FormData) {
  const phoneRaw = (formData.get('phone') as string) ?? '';
  const phoneDigits = phoneRaw.replace(/[^0-9]/g, '');

  const parsed = loginPhoneSchema.safeParse({
    phone: phoneDigits,
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Dados inválidos' };
  }

  const supabase = await createClient();
  const { data: emailFound, error: rpcError } = await supabase.rpc(
    'email_by_phone',
    {
      p_phone: parsed.data.phone,
    },
  );

  if (rpcError || !emailFound) {
    return { error: 'Telefone ou senha incorretos' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: emailFound as string,
    password: parsed.data.password,
  });
  if (error) {
    return { error: 'Telefone ou senha incorretos' };
  }

  redirect('/app/dashboard');
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/app/dashboard`,
    },
  });

  if (error) {
    console.error('[auth] google oauth error:', error);
    return { error: 'Erro ao conectar com o Google' };
  }
  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/app/entrar');
}
