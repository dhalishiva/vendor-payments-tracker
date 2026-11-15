import type { PaymentStatus } from '../types';

const STATUS_CLASSES: Record<PaymentStatus, string> = {
  scheduled: 'bg-sky-100 text-sky-800',
  paid: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-rose-100 text-rose-800',
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  scheduled: 'Scheduled',
  paid: 'Paid',
  failed: 'Failed',
};

/** Status is shown as text as well as colour, so it does not rely on colour alone. */
export function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
