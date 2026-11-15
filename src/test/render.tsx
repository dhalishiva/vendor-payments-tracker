import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ROUTER_FUTURE_FLAGS } from '@/shared/config/router';

interface RenderOptions {
  /** Initial URL, including any query string. */
  route: string;
  /** Route pattern that renders `ui`, such as "/payments/:id". */
  path: string;
}

/** Renders a page with a fresh query cache and an in-memory router. Retries are off so failures show at once. */
export function renderAt(ui: ReactElement, { route, path }: RenderOptions) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]} future={ROUTER_FUTURE_FLAGS}>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
