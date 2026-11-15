import { delay, http, HttpResponse } from 'msw';
import { paymentStatusSchema, type PaymentStatus } from '@/features/payments/types';
import { settingsSchema } from '@/features/settings/types';
import { getPayment, getSettings, listPayments, saveSettings, setPaymentStatus } from './db';

const LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 250;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;
const NOT_FOUND_MESSAGE = 'Payment not found.';

function parsePositiveInt(raw: string | null, fallback: number): number {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function notFound(message: string) {
  return HttpResponse.json({ message }, { status: 404 });
}

/** Applies a status change only when the payment is in one of the allowed states. */
function transition(id: string, allowedFrom: PaymentStatus[], to: PaymentStatus, conflictMessage: string) {
  const current = getPayment(id);
  if (!current) return notFound(NOT_FOUND_MESSAGE);
  if (!allowedFrom.includes(current.status)) {
    return HttpResponse.json({ message: conflictMessage }, { status: 409 });
  }
  const updated = setPaymentStatus(current.id, to);
  return updated ? HttpResponse.json(updated) : notFound(NOT_FOUND_MESSAGE);
}

// Paths use a wildcard origin so the same handlers serve the browser worker and Node tests.
export const handlers = [
  http.get('*/api/payments', async ({ request }) => {
    await delay(LATENCY_MS);
    const url = new URL(request.url);

    const rawStatus = url.searchParams.get('status') ?? 'all';
    if (rawStatus !== 'all' && !paymentStatusSchema.safeParse(rawStatus).success) {
      return HttpResponse.json({ message: 'Unknown status filter.' }, { status: 400 });
    }

    const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
    const page = parsePositiveInt(url.searchParams.get('page'), 1);
    const pageSize = Math.min(parsePositiveInt(url.searchParams.get('pageSize'), DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);

    const matches = listPayments().filter(
      (payment) =>
        (rawStatus === 'all' || payment.status === rawStatus) &&
        (query === '' || payment.vendor.toLowerCase().includes(query)),
    );

    const start = (page - 1) * pageSize;
    return HttpResponse.json({
      items: matches.slice(start, start + pageSize),
      total: matches.length,
      page,
      pageSize,
    });
  }),

  http.get('*/api/payments/:id', async ({ params }) => {
    await delay(LATENCY_MS);
    const payment = getPayment(String(params.id));
    return payment ? HttpResponse.json(payment) : notFound(NOT_FOUND_MESSAGE);
  }),

  http.post('*/api/payments/:id/mark-paid', async ({ params }) => {
    await delay(LATENCY_MS);
    return transition(
      String(params.id),
      ['scheduled', 'failed'],
      'paid',
      'Only scheduled or failed payments can be marked as paid.',
    );
  }),

  http.post('*/api/payments/:id/retry', async ({ params }) => {
    await delay(LATENCY_MS);
    return transition(String(params.id), ['failed'], 'scheduled', 'Only failed payments can be retried.');
  }),

  http.get('*/api/settings', async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(getSettings());
  }),

  http.put('*/api/settings', async ({ request }) => {
    await delay(LATENCY_MS);
    const parsed = settingsSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return HttpResponse.json(
        { message: 'Settings are invalid. Check the currency and email address.' },
        { status: 400 },
      );
    }
    return HttpResponse.json(saveSettings(parsed.data));
  }),
];
