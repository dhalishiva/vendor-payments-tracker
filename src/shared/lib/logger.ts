/**
 * Single place for reporting unexpected errors. In development it logs to the console.
 * Forward production errors to a monitoring service here once one is configured.
 */
export function reportError(error: unknown, context?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.error('[app]', error, context);
  }
}
