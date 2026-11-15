import { z } from 'zod';

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'] as const;

export const currencySchema = z.enum(CURRENCIES);
export type Currency = z.infer<typeof currencySchema>;
