import { expect, test } from '@playwright/test';

test('opens a failed payment from a direct link and retries it', async ({ page }) => {
  await page.goto('/payments/pay_003');

  await expect(page.getByRole('heading', { name: /INV-2403/ })).toBeVisible();
  await page.getByRole('button', { name: 'Retry' }).click();

  await expect(page.getByText('Scheduled', { exact: true })).toBeVisible();
});

test('lists payments and reaches the detail page', async ({ page }) => {
  await page.goto('/payments');

  await page.getByRole('link', { name: 'INV-2401' }).click();

  await expect(page).toHaveURL(/\/payments\/pay_001$/);
  await expect(page.getByRole('button', { name: 'Mark as paid' })).toBeVisible();
});

test('shows the app not-found page for an unknown route', async ({ page }) => {
  await page.goto('/no-such-page');

  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});
