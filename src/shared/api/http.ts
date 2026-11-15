import type { z } from 'zod';

const GENERIC_ERROR_MESSAGE = 'The request could not be completed. Please try again.';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE: string = import.meta.env.VITE_API_URL ?? '';

/**
 * Sends a JSON request and validates the response against `schema`.
 * Throws ApiError for non-2xx responses, using the server's safe `message` when present.
 */
export async function http<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const base = API_BASE || window.location.origin;
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');
  if (init?.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${base}${path}`, {
    credentials: 'include',
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return schema.parse(await response.json());
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (typeof body === 'object' && body !== null && 'message' in body && typeof body.message === 'string') {
      return body.message;
    }
  } catch {
    // The error body is not JSON; fall back to the generic message below.
  }
  return GENERIC_ERROR_MESSAGE;
}
