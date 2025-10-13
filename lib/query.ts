import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/query-persist-client-core';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { mmkvGetString, mmkvSetString, mmkvDelete } from './mmkv';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 1,
    },
  },
});

export const persister = createSyncStoragePersister({
  storage: {
    getItem: (key: string) => mmkvGetString(key),
    setItem: (key: string, value: string) => mmkvSetString(key, value),
    removeItem: (key: string) => mmkvDelete(key),
  },
  key: 'rq-cache',
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 24 * 60 * 60 * 1000,
});
