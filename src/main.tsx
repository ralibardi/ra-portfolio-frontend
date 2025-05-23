import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import App from '@app/app';
import ErrorBoundary from '@components/error-boundary';
import { ThemeProvider } from '@contexts/theme-context';
import PWAPrompt from 'react-ios-pwa-prompt';

import '@assets/index.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider>
          <PWAPrompt appIconPath="favicon.ico" />
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>,
);
