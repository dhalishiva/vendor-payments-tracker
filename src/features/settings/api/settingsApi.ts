import { http } from '@/shared/api/http';
import { settingsSchema, type Settings } from '../types';

export const settingsKeys = {
  all: ['settings'] as const,
};

export function fetchSettings(signal?: AbortSignal) {
  return http('/api/settings', settingsSchema, { signal });
}

export function saveSettings(settings: Settings) {
  return http('/api/settings', settingsSchema, {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}
