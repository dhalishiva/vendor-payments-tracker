import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-slate-600">The page you were looking for doesn't exist or has moved.</p>
      <Link to="/payments" className="inline-block text-indigo-700 underline-offset-2 hover:underline">
        Go to payments
      </Link>
    </section>
  );
}
