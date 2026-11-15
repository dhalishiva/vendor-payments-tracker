import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSettings, saveSettings, settingsKeys } from '../api/settingsApi';

export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: ({ signal }) => fetchSettings(signal),
  });
}

export function useSaveSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSettings,
    onSuccess: (saved) => {
      queryClient.setQueryData(settingsKeys.all, saved);
    },
  });
}
