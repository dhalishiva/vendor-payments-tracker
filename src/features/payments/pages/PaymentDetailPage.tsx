import { Link, useParams } from 'react-router-dom';
import { ApiError } from '@/shared/api/http';
import { Button } from '@/shared/components/Button';
import { getErrorMessage } from '@/shared/lib/errors';
import { PaymentDetails } from '../components/PaymentDetails';
import { useMarkPaymentAsPaid, useRetryPayment } from '../hooks/usePaymentActions';
import { usePayment } from '../hooks/usePayments';

function BackLink() {
  return (
    <Link to="/payments" className="text-sm text-indigo-700 underline-offset-2 hover:underline">
      ← Back to payments
    </Link>
  );
}

export function PaymentDetailPage() {
  const { id = '' } = useParams();
  const paymentQuery = usePayment(id);
  const markAsPaid = useMarkPaymentAsPaid(id);
  const retry = useRetryPayment(id);

  if (paymentQuery.isPending) {
    return (
      <section className="space-y-4">
        <BackLink />
        <p role="status">Loading payment…</p>
      </section>
    );
  }

  if (paymentQuery.isError) {
    const isNotFound = paymentQuery.error instanceof ApiError && paymentQuery.error.status === 404;
    return (
      <section className="space-y-4">
        <BackLink />
        {isNotFound ? (
          <div>
            <h1 className="text-2xl font-semibold">Payment not found</h1>
            <p className="mt-2 text-slate-600">No payment matches this link. It may have been removed.</p>
          </div>
        ) : (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-md bg-rose-50 p-4 text-rose-900">
            <p>We couldn't load this payment.</p>
            <Button variant="secondary" onClick={() => void paymentQuery.refetch()}>
              Try again
            </Button>
          </div>
        )}
      </section>
    );
  }

  const payment = paymentQuery.data;

  return (
    <section aria-labelledby="payment-heading" className="space-y-6">
      <BackLink />

      <h1 id="payment-heading" className="text-2xl font-semibold">
        Invoice {payment.invoiceNumber}
      </h1>

      <PaymentDetails payment={payment} />

      <div className="flex flex-wrap gap-3">
        {payment.status !== 'paid' && (
          <Button onClick={() => markAsPaid.mutate()} disabled={markAsPaid.isPending}>
            {markAsPaid.isPending ? 'Marking as paid…' : 'Mark as paid'}
          </Button>
        )}
        {payment.status === 'failed' && (
          <Button variant="secondary" onClick={() => retry.mutate()} disabled={retry.isPending}>
            {retry.isPending ? 'Retrying…' : 'Retry'}
          </Button>
        )}
      </div>

      {markAsPaid.isSuccess && <p role="status">Payment marked as paid.</p>}
      {markAsPaid.isError && <p role="alert" className="text-rose-700">{getErrorMessage(markAsPaid.error)}</p>}
      {retry.isSuccess && <p role="status">Payment re-queued and scheduled again.</p>}
      {retry.isError && <p role="alert" className="text-rose-700">{getErrorMessage(retry.error)}</p>}
    </section>
  );
}
