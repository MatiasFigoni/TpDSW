import { api } from './api.ts';

export interface CreatePayInput {
  idTurn: number;
  amount: number;
  method: 'efectivo' | 'tarjeta';
  status?: 'PENDIENTE' | 'PAGADO';
}

export interface PayResponse {
  message: string;
  data: {
    id: number;
    amount: number;
    status: string;
    date: string;
    method: string;
    transactionId: string;
  };
  turnStatus: string;
}

export async function createPayment(input: CreatePayInput): Promise<PayResponse> {
  const response = await api('/api/payments', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar el pago');
  }
  return response.json();
}

export async function updatePaymentStatus(
  id: number,
  newStatus: 'PENDIENTE' | 'EN_PROCESO' | 'PAGADO' | 'RECHAZADO' | 'CANCELADO' | 'REEMBOLSADO'
): Promise<any> {
  const response = await api(`/api/payments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ newStatus }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el estado del pago');
  }
  return response.json();
}

