import { NavLink, Outlet } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'font-semibold text-indigo-700'
    : 'text-slate-600 hover:text-slate-900 underline-offset-2 hover:underline';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <span className="font-semibold">Vendor payments</span>
          <nav aria-label="Main">
            <ul className="flex gap-5 text-sm">
              <li>
                <NavLink to="/payments" className={navLinkClass}>
                  Payments
                </NavLink>
              </li>
              <li>
                <NavLink to="/settings" className={navLinkClass}>
                  Settings
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <p className="bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
        Demo: all data is mocked in your browser. Changes reset when you reload the page.
      </p>

      <main id="main" className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
