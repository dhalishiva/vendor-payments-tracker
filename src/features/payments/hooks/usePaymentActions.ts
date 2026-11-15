import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markPaymentAsPaid, paymentKeys, retryPayment } from '../api/paymentsApi';

export function useMarkPaymentAsPaid(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markPaymentAsPaid(id),
    onSuccess: async (payment) => {
      queryClient.setQueryData(paymentKeys.detail(id), payment);
      await queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
    },
  });
}

export function useRetryPayment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => retryPayment(id),
    onSuccess: async (payment) => {
      queryClient.setQueryData(paymentKeys.detail(id), payment);
      await queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
    },
  });
}
