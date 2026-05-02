import { createClient } from '@/lib/supabase/server';

/**
 * Fetches a consultant by slug with all of their active products.
 * Used on public store pages: /loja/[slug]
 */
export async function getConsultantBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('consultants')
    .select('*, products(*)')
    .eq('slug', slug)
    .eq('products.is_active', true)
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
export async function getCurrentConsultant() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from('consultants')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return data;
}

/**
 * Returns all orders for a consultant, newest first.
 * Includes each order's line items.
 */
export async function getOrdersByConsultant(consultantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('consultant_id', consultantId)
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
export async function getProductsByConsultant(consultantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('consultant_id', consultantId)
    .order('sort_order', { ascending: true });

  if (error) {
    return [];
  }
  return data;
}
