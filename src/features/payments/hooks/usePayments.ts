import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchPayment, fetchPayments, paymentKeys, type PaymentListParams } from '../api/paymentsApi';

export function usePayments(params: PaymentListParams) {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: ({ signal }) => fetchPayments(params, signal),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: ({ signal }) => fetchPayment(id, signal),
    enabled: id !== '',
  });
}
