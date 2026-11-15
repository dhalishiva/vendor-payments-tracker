import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PaymentDetailPage, PaymentsPage } from '@/features/payments';
import { SettingsPage } from '@/features/settings';
import { ApiError } from '@/shared/api/http';
import { ROUTER_FUTURE_FLAGS } from '@/shared/config/router';
import { AppErrorBoundary } from './AppErrorBoundary';
import { AppLayout } from './AppLayout';
import { NotFoundPage } from './NotFoundPage';

function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Client errors (4xx) will not change on retry; only retry once on other failures.
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
      },
    },
  });
}

const queryClient = createAppQueryClient();

export function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={ROUTER_FUTURE_FLAGS}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/payments" replace />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="payments/:id" element={<PaymentDetailPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <Analytics />
      <SpeedInsights />
    </AppErrorBoundary>
  );
}
