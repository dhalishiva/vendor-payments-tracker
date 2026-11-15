import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CURRENCIES } from '@/shared/config/currencies';
import { Button } from '@/shared/components/Button';
import { getErrorMessage } from '@/shared/lib/errors';
import { useSaveSettings } from '../hooks/useSettings';
import { settingsSchema, type Settings } from '../types';

interface SettingsFormProps {
  initialValues: Settings;
}

export function SettingsForm({ initialValues }: SettingsFormProps) {
  const saveMutation = useSaveSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Settings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialValues,
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
      className="max-w-md space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div>
        <label htmlFor="default-currency" className="block text-sm font-medium text-slate-700">
          Default currency
        </label>
        <select
          id="default-currency"
          aria-invalid={errors.defaultCurrency ? true : undefined}
          aria-describedby={errors.defaultCurrency ? 'default-currency-error' : undefined}
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          {...register('defaultCurrency')}
        >
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        {errors.defaultCurrency && (
          <p id="default-currency-error" className="mt-1 text-sm text-rose-700">
            {errors.defaultCurrency.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="notification-email" className="block text-sm font-medium text-slate-700">
          Notification email
        </label>
        <input
          id="notification-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.notificationEmail ? true : undefined}
          aria-describedby={errors.notificationEmail ? 'notification-email-error' : undefined}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          {...register('notificationEmail')}
        />
        {errors.notificationEmail && (
          <p id="notification-email-error" className="mt-1 text-sm text-rose-700">
            {errors.notificationEmail.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Saving…' : 'Save settings'}
        </Button>
        {saveMutation.isSuccess && <p role="status" className="text-sm text-emerald-700">Settings saved.</p>}
      </div>

      {saveMutation.isError && (
        <p role="alert" className="text-sm text-rose-700">
          {getErrorMessage(saveMutation.error)}
        </p>
      )}
    </form>
  );
}
