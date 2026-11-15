import { formatAmount, formatDueDate } from '@/shared/lib/format';
import type { Payment } from '../types';
import { StatusBadge } from './StatusBadge';

export function PaymentDetails({ payment }: { payment: Payment }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-lg border border-slate-200 bg-white p-6 sm:grid-cols-2">
      <div>
        <dt className="text-sm text-slate-500">Vendor</dt>
        <dd className="mt-1 font-medium">{payment.vendor}</dd>
      </div>
      <div>
        <dt className="text-sm text-slate-500">Invoice number</dt>
        <dd className="mt-1 font-medium">{payment.invoiceNumber}</dd>
      </div>
      <div>
        <dt className="text-sm text-slate-500">Amount</dt>
        <dd className="mt-1 tabular-nums">{formatAmount(payment.amount)}</dd>
      </div>
      <div>
        <dt className="text-sm text-slate-500">Currency</dt>
        <dd className="mt-1">{payment.currency}</dd>
      </div>
      <div>
        <dt className="text-sm text-slate-500">Due date</dt>
        <dd className="mt-1">{formatDueDate(payment.dueDate)}</dd>
      </div>
      <div>
        <dt className="text-sm text-slate-500">Status</dt>
        <dd className="mt-1">
          <StatusBadge status={payment.status} />
        </dd>
      </div>
    </dl>
  );
}
