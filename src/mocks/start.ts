/**
 * Starts the in-browser mock backend before the app renders, so the first requests are mocked.
 * Set VITE_ENABLE_MOCKS=false to skip it when a real API is available.
 */
export async function startMocking(): Promise<void> {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'false') return;
  const { worker } = await import('./browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}
