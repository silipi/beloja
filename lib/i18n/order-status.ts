import type { Enums } from '@/lib/supabase/types';

type OrderStatus = Enums<'order_status'>;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Novo pedido',
  confirmed: 'Confirmado',
  paid: 'Pago',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status];
}
