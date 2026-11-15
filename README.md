# Vendor payments tracker

A single-page app for an accounts payable team to review vendor payments, mark them as paid, and retry failed ones.

**The data is mocked.** There is no backend yet. An in-browser mock (Mock Service Worker) answers the same `/api` calls a real backend would. Changes reset when the page is reloaded.

## Pages

- `/payments`: table of payments with status filter, vendor search (debounced) and paging. Filters and page are stored in the URL.
- `/payments/:id`: payment detail with **Mark as paid** (scheduled or failed payments) and **Retry** (failed payments only).
- `/settings`: default currency and notification email, with validation.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # unit and component tests (Vitest + Testing Library + MSW)
npm run build        # type-check and production build
npm run test:e2e     # Playwright end-to-end tests (needs a browser installed)
```

Copy `.env.example` to `.env.local` to change the API base URL or turn off the mock (`VITE_ENABLE_MOCKS=false`).

## API contract assumed

| Method | Path | Notes |
|---|---|---|
| GET | `/api/payments?status=all\|scheduled\|paid\|failed&q=&page=&pageSize=` | Server-side filtering and paging. Returns `{ items, total, page, pageSize }`. |
| GET | `/api/payments/:id` | 404 when not found. |
| POST | `/api/payments/:id/mark-paid` | 409 unless the payment is scheduled or failed. |
| POST | `/api/payments/:id/retry` | 409 unless the payment is failed. Moves it to scheduled. |
| GET | `/api/settings` | Returns `{ defaultCurrency, notificationEmail }`. |
| PUT | `/api/settings` | Same body. 400 when invalid. |

Errors return `{ "message": "..." }` with a safe, human-readable message.

## Structure

```
src/
  app/              routing, layout, root error boundary
  features/
    payments/       api, hooks, components and pages for payments
    settings/       api, hooks, form and page for settings
  shared/           http client, formatting, config, shared UI
  mocks/            in-browser and Node mock backend
  test/             test setup and render helper
e2e/                Playwright journeys
```

## Deployment

Hosted on Vercel. `vercel.json` rewrites every path to `index.html`, so direct links and refreshes on `/payments/:id` work. Web Analytics and Speed Insights are mounted in `App.tsx`.
