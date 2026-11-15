import { useSearchParams } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { PaymentFilters } from '../components/PaymentFilters';
import { PaymentsPagination } from '../components/PaymentsPagination';
import { PaymentsTable } from '../components/PaymentsTable';
import type { PaymentListParams } from '../api/paymentsApi';
import { usePayments } from '../hooks/usePayments';
import { statusFilterSchema, type StatusFilter } from '../types';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

function parseStatusParam(raw: string | null): StatusFilter {
  const parsed = statusFilterSchema.safeParse(raw ?? 'all');
  return parsed.success ? parsed.data : 'all';
}

function parsePageParam(raw: string | null): number {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : 1;
}

/** Filters, search and page live in the URL so they survive reloads and can be shared. */
export function PaymentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = parseStatusParam(searchParams.get('status'));
  const search = searchParams.get('q') ?? '';
  const page = parsePageParam(searchParams.get('page'));

  // The input updates immediately; the request waits until typing pauses.
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const params: PaymentListParams = { status, search: debouncedSearch, page, pageSize: PAGE_SIZE };
  const query = usePayments(params);

  const handleStatusChange = (nextStatus: StatusFilter) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (nextStatus === 'all') next.delete('status');
      else next.set('status', nextStatus);
      next.delete('page');
      return next;
    });
  };

  const handleSearchChange = (nextSearch: string) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (nextSearch === '') next.delete('q');
        else next.set('q', nextSearch);
        next.delete('page');
        return next;
      },
      { replace: true },
    );
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (nextPage <= 1) next.delete('page');
      else next.set('page', String(nextPage));
      return next;
    });
  };

  const clearFilters = () => setSearchParams(new URLSearchParams());

  return (
    <section aria-labelledby="payments-heading" className="space-y-4">
      <h1 id="payments-heading" className="text-2xl font-semibold">
        Payments
      </h1>

      <PaymentFilters
        status={status}
        search={search}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
      />

      {query.isPending && <p role="status">Loading payments…</p>}

      {query.isError && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-md bg-rose-50 p-4 text-rose-900">
          <p>We couldn't load payments.</p>
          <Button variant="secondary" onClick={() => void query.refetch()}>
            Try again
          </Button>
        </div>
      )}

      {query.isSuccess && query.data.items.length === 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-dashed border-slate-300 bg-white p-6">
          <p>No payments match these filters.</p>
          <Button variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}

      {query.isSuccess && query.data.items.length > 0 && (
        <div aria-busy={query.isPlaceholderData} className={query.isPlaceholderData ? 'opacity-60' : undefined}>
          <PaymentsTable items={query.data.items} />
          <div className="mt-4">
            <PaymentsPagination
              page={query.data.page}
              pageSize={query.data.pageSize}
              total={query.data.total}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </section>
  );
}
