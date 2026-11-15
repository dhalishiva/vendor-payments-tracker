import { z } from 'zod';
import { currencySchema } from '@/shared/config/currencies';

export const PAYMENT_STATUSES = ['scheduled', 'paid', 'failed'] as const;

export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

/** Value of the status filter: every status, or "all" for no filter. */
export const statusFilterSchema = z.enum(['all', ...PAYMENT_STATUSES]);
export type StatusFilter = z.infer<typeof statusFilterSchema>;

export const paymentSchema = z.object({
  id: z.string(),
  vendor: z.string(),
  invoiceNumber: z.string(),
  amount: z.number().nonnegative(),
  currency: currencySchema,
  /** Calendar date in YYYY-MM-DD form. */
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: paymentStatusSchema,
});
export type Payment = z.infer<typeof paymentSchema>;

export const paymentPageSchema = z.object({
  items: z.array(paymentSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});
export type PaymentPage = z.infer<typeof paymentPageSchema>;
