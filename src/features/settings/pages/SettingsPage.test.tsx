import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { renderAt } from '@/test/render';
import { SettingsPage } from './SettingsPage';

function renderPage() {
  return renderAt(<SettingsPage />, { route: '/settings', path: '/settings' });
}

describe('SettingsPage', () => {
  it('loads the saved settings into the form', async () => {
    renderPage();

    expect(await screen.findByLabelText('Notification email')).toHaveValue('ap-team@example.com');
    expect(screen.getByLabelText('Default currency')).toHaveValue('USD');
  });

  it('saves changed settings', async () => {
    const user = userEvent.setup();
    renderPage();
    const emailInput = await screen.findByLabelText('Notification email');

    await user.clear(emailInput);
    await user.type(emailInput, 'finance@example.com');
    await user.selectOptions(screen.getByLabelText('Default currency'), 'EUR');
    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    expect(await screen.findByText('Settings saved.')).toBeInTheDocument();
  });

  it('shows a validation error and does not save an invalid email', async () => {
    const user = userEvent.setup();
    let saveCalled = false;
    server.use(
      http.put('*/api/settings', () => {
        saveCalled = true;
        return HttpResponse.json({});
      }),
    );
    renderPage();
    const emailInput = await screen.findByLabelText('Notification email');

    await user.clear(emailInput);
    await user.type(emailInput, 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    expect(await screen.findByText('Enter a valid email address, such as ap@example.com.')).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(saveCalled).toBe(false);
  });

  it('shows an error and keeps the typed values when saving fails', async () => {
    const user = userEvent.setup();
    server.use(
      http.put('*/api/settings', () =>
        HttpResponse.json({ message: 'Could not save settings right now.' }, { status: 500 }),
      ),
    );
    renderPage();
    const emailInput = await screen.findByLabelText('Notification email');

    await user.clear(emailInput);
    await user.type(emailInput, 'finance@example.com');
    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not save settings right now.');
    expect(emailInput).toHaveValue('finance@example.com');
  });
});
