import { Link } from 'react-router-dom';
import { formatAmount, formatDueDate } from '@/shared/lib/format';
import type { Payment } from '../types';
import { StatusBadge } from './StatusBadge';

interface PaymentsTableProps {
  items: Payment[];
}

export function PaymentsTable({ items }: PaymentsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <caption className="sr-only">Vendor payments</caption>
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Vendor</th>
            <th scope="col" className="px-4 py-3 font-medium">Invoice</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Amount</th>
            <th scope="col" className="px-4 py-3 font-medium">Currency</th>
            <th scope="col" className="px-4 py-3 font-medium">Due date</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((payment) => (
            <tr key={payment.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">{payment.vendor}</td>
              <td className="px-4 py-3">
                <Link
                  to={`/payments/${encodeURIComponent(payment.id)}`}
                  className="font-medium text-indigo-700 underline-offset-2 hover:underline"
                >
                  {payment.invoiceNumber}
                </Link>
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{formatAmount(payment.amount)}</td>
              <td className="px-4 py-3">{payment.currency}</td>
              <td className="px-4 py-3">{formatDueDate(payment.dueDate)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={payment.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
