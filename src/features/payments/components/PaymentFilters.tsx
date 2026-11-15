import { statusFilterSchema, type StatusFilter } from '../types';

const STATUS_OPTIONS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
];

interface PaymentFiltersProps {
  status: StatusFilter;
  search: string;
  onStatusChange: (status: StatusFilter) => void;
  onSearchChange: (search: string) => void;
}

export function PaymentFilters({ status, search, onStatusChange, onSearchChange }: PaymentFiltersProps) {
  return (
    <div role="search" className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div>
        <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(event) => {
            const parsed = statusFilterSchema.safeParse(event.target.value);
            if (parsed.success) onStatusChange(parsed.data);
          }}
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm sm:w-48"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="vendor-search" className="block text-sm font-medium text-slate-700">
          Search vendor
        </label>
        <input
          id="vendor-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="e.g. Acme"
          autoComplete="off"
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-72"
        />
      </div>
    </div>
  );
}
