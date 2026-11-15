const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dueDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Formats a decimal amount with two fraction digits, e.g. 1234.5 -> "1,234.50". */
export function formatAmount(amount: number): string {
  return amountFormatter.format(amount);
}

/** Formats an ISO calendar date (YYYY-MM-DD) without shifting it across time zones. */
export function formatDueDate(isoDate: string): string {
  return dueDateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}
