import { http } from '@/shared/api/http';
import { paymentPageSchema, paymentSchema, type StatusFilter } from '../types';

export interface PaymentListParams {
  status: StatusFilter;
  search: string;
  page: number;
  pageSize: number;
}

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (params: PaymentListParams) => [...paymentKeys.lists(), params] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
};

export function fetchPayments(params: PaymentListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({
    status: params.status,
    q: params.search,
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  return http(`/api/payments?${query.toString()}`, paymentPageSchema, { signal });
}

export function fetchPayment(id: string, signal?: AbortSignal) {
  return http(`/api/payments/${encodeURIComponent(id)}`, paymentSchema, { signal });
}

export function markPaymentAsPaid(id: string) {
  return http(`/api/payments/${encodeURIComponent(id)}/mark-paid`, paymentSchema, { method: 'POST' });
}

export function retryPayment(id: string) {
  return http(`/api/payments/${encodeURIComponent(id)}/retry`, paymentSchema, { method: 'POST' });
}
