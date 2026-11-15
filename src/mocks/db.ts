import type { Payment, PaymentStatus } from '@/features/payments/types';
import type { Settings } from '@/features/settings/types';
import { CURRENCIES } from '@/shared/config/currencies';

const VENDORS = [
  'Acme Industrial Supplies',
  'Northwind Logistics',
  'Globex Software',
  'Initech Facilities',
  'Umbrella Packaging',
  'Stark Office Co',
  'Wayne Consulting',
  'Hooli Cloud Services',
  'Vandelay Imports',
  'Pied Piper Hosting',
] as const;

const STATUSES: readonly PaymentStatus[] = ['scheduled', 'paid', 'failed'];
const SEED_COUNT = 60;

const DEFAULT_SETTINGS: Settings = {
  defaultCurrency: 'USD',
  notificationEmail: 'ap-team@example.com',
};

/** Deterministic seed data, so the demo looks the same on every load. */
function buildSeed(): Payment[] {
  return Array.from({ length: SEED_COUNT }, (_, index) => {
    const number = index + 1;
    return {
      id: `pay_${String(number).padStart(3, '0')}`,
      vendor: VENDORS[index % VENDORS.length],
      invoiceNumber: `INV-${2400 + number}`,
      amount: Number((150 + ((index * 7919) % 90000) / 100).toFixed(2)),
      currency: CURRENCIES[index % CURRENCIES.length],
      dueDate: new Date(Date.UTC(2026, 10, 1 + ((index * 3) % 75))).toISOString().slice(0, 10),
      status: STATUSES[index % STATUSES.length],
    };
  });
}

// In-memory state. It lives in the page and resets on reload.
let payments: Payment[] = buildSeed();
let settings: Settings = { ...DEFAULT_SETTINGS };

export function listPayments(): Payment[] {
  return payments.map((payment) => ({ ...payment }));
}

export function getPayment(id: string): Payment | undefined {
  const payment = payments.find((item) => item.id === id);
  return payment ? { ...payment } : undefined;
}

export function setPaymentStatus(id: string, status: PaymentStatus): Payment | undefined {
  const index = payments.findIndex((item) => item.id === id);
  if (index === -1) return undefined;
  payments[index] = { ...payments[index], status };
  return { ...payments[index] };
}

export function getSettings(): Settings {
  return { ...settings };
}

export function saveSettings(next: Settings): Settings {
  settings = { ...next };
  return { ...settings };
}

export function resetMockDb(): void {
  payments = buildSeed();
  settings = { ...DEFAULT_SETTINGS };
}
