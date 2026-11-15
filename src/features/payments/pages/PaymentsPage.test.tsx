import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { renderAt } from '@/test/render';
import { PaymentsPage } from './PaymentsPage';

// Seed data (see src/mocks/db.ts): INV-2401 is "Acme Industrial Supplies" and scheduled;
// INV-2403 is "Globex Software" and failed.
function renderPage(route = '/payments') {
  return renderAt(<PaymentsPage />, { route, path: '/payments' });
}

describe('PaymentsPage', () => {
  it('lists payments from the API', async () => {
    renderPage();

    expect(await screen.findByRole('link', { name: 'INV-2401' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('filters the table by status', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('link', { name: 'INV-2401' });

    await user.selectOptions(screen.getByLabelText('Status'), 'failed');

    const table = screen.getByRole('table');
    await waitFor(() => expect(within(table).queryByText('Scheduled')).not.toBeInTheDocument());
    expect(within(table).getAllByText('Failed').length).toBeGreaterThan(0);
  });

  it('searches vendors after typing pauses', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('link', { name: 'INV-2401' });

    await user.type(screen.getByLabelText('Search vendor'), 'Globex');

    await waitFor(() => expect(screen.queryByRole('link', { name: 'INV-2401' })).not.toBeInTheDocument());
    expect(screen.getByRole('link', { name: 'INV-2403' })).toBeInTheDocument();
  });

  it('shows an empty state when no payments match', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('link', { name: 'INV-2401' });

    await user.type(screen.getByLabelText('Search vendor'), 'zzzz-no-such-vendor');

    expect(await screen.findByText('No payments match these filters.')).toBeInTheDocument();
  });

  it('moves to the next page', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('link', { name: 'INV-2401' });

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(await screen.findByRole('link', { name: 'INV-2411' })).toBeInTheDocument();
    expect(screen.getByText(/Page 2 of 6/)).toBeInTheDocument();
  });

  it('shows an error with a retry option when the list fails to load', async () => {
    server.use(
      http.get('*/api/payments', () => HttpResponse.json({ message: 'Database unavailable.' }, { status: 500 })),
    );
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent("We couldn't load payments.");
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
