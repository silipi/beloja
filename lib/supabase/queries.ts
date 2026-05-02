import { createClient } from '@/lib/supabase/server';

/**
 * Fetches a consultant by slug with all of their active products.
 * Used on public store pages: /loja/[slug]
 */
export async function getConsultoraBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('consultoras')
    .select('*, produtos(*)')
    .eq('slug', slug)
    .eq('produtos.ativo', true)
    .single();

  if (error) {
    return null;
  }
  return data;
}

/**
 * Returns the currently authenticated consultant.
 * Used on the consultant dashboard.
 */
export async function getCurrentConsultora() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from('consultoras')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return data;
}

/**
 * Returns all orders for a consultant, newest first.
 * Includes each order's line items.
 */
export async function getPedidosDaConsultora(consultoraId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, pedido_items(*)')
    .eq('consultora_id', consultoraId)
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }
  return data;
}

/**
 * Returns all products for a consultant.
 * No active filter, for use in the consultant's own dashboard.
 */
export async function getProdutosDaConsultora(consultoraId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('consultora_id', consultoraId)
    .order('posicao', { ascending: true });

  if (error) {
    return [];
  }
  return data;
}
