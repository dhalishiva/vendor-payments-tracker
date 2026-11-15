import { ApiError } from '@/shared/api/http';

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

/** Returns a message that is safe to show to a user for any thrown value. */
export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : FALLBACK_MESSAGE;
}
