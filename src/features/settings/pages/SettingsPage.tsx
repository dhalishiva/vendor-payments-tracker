import { Button } from '@/shared/components/Button';
import { SettingsForm } from '../components/SettingsForm';
import { useSettings } from '../hooks/useSettings';

export function SettingsPage() {
  const settingsQuery = useSettings();

  return (
    <section aria-labelledby="settings-heading" className="space-y-4">
      <h1 id="settings-heading" className="text-2xl font-semibold">
        Settings
      </h1>

      {settingsQuery.isPending && <p role="status">Loading settings…</p>}

      {settingsQuery.isError && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-md bg-rose-50 p-4 text-rose-900">
          <p>We couldn't load your settings.</p>
          <Button variant="secondary" onClick={() => void settingsQuery.refetch()}>
            Try again
          </Button>
        </div>
      )}

      {settingsQuery.isSuccess && <SettingsForm initialValues={settingsQuery.data} />}
    </section>
  );
}
