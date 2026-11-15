import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { renderAt } from '@/test/render';
import { PaymentDetailPage } from './PaymentDetailPage';

// Seed data: pay_001 is scheduled; pay_003 is failed.
function renderPage(id: string) {
  return renderAt(<PaymentDetailPage />, { route: `/payments/${id}`, path: '/payments/:id' });
}

describe('PaymentDetailPage', () => {
  it('marks a scheduled payment as paid', async () => {
    const user = userEvent.setup();
    renderPage('pay_001');

    await user.click(await screen.findByRole('button', { name: 'Mark as paid' }));

    expect(await screen.findByText('Payment marked as paid.')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Mark as paid' })).not.toBeInTheDocument();
  });

  it('retries a failed payment and shows it as scheduled', async () => {
    const user = userEvent.setup();
    renderPage('pay_003');

    await user.click(await screen.findByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Scheduled')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });

  it('does not offer Retry for a scheduled payment', async () => {
    renderPage('pay_001');

    await screen.findByRole('button', { name: 'Mark as paid' });
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });

  it('shows the server message when marking as paid fails', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('*/api/payments/:id/mark-paid', () =>
        HttpResponse.json({ message: 'The payment service is unavailable.' }, { status: 503 }),
      ),
    );
    renderPage('pay_001');

    await user.click(await screen.findByRole('button', { name: 'Mark as paid' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('The payment service is unavailable.');
    expect(screen.getByRole('button', { name: 'Mark as paid' })).toBeEnabled();
  });

  it('shows a not-found message for an unknown payment', async () => {
    renderPage('pay_unknown');

    expect(await screen.findByRole('heading', { name: 'Payment not found' })).toBeInTheDocument();
  });

  it('shows an error with a retry option when the payment fails to load', async () => {
    server.use(
      http.get('*/api/payments/:id', () => HttpResponse.json({ message: 'Server error.' }, { status: 500 })),
    );
    renderPage('pay_001');

    expect(await screen.findByRole('alert')).toHaveTextContent("We couldn't load this payment.");
  });
});
