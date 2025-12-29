'use client';

import type { AppDictionary } from '@app/i18n/get-dictionary';
import ErrorBoundary from '@components/error-boundary';
import ToastContainer from '@components/toast';
import { ThemeProvider } from '@contexts/theme-context';
import { ToastProvider } from '@contexts/toast-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useMemo } from 'react';

interface ProvidersProps {
  readonly children: ReactNode;
  readonly dictionary: AppDictionary;
}

export const Providers = ({ children, dictionary }: ProvidersProps) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary dictionary={dictionary}>
        <ThemeProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};
