import { z } from 'zod';
import { currencySchema } from '@/shared/config/currencies';

export const settingsSchema = z.object({
  defaultCurrency: currencySchema,
  notificationEmail: z
    .string()
    .trim()
    .min(1, 'Enter a notification email address.')
    .email('Enter a valid email address, such as ap@example.com.'),
});

export type Settings = z.infer<typeof settingsSchema>;
