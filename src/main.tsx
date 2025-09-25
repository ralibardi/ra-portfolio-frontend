import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import App from '@app/app';
import ErrorBoundary from '@components/error-boundary';
import { ThemeProvider } from '@contexts/theme-context';
import { ToastProvider } from '@contexts/toast-context';
import ToastContainer from '@components/toast';
import PWAPrompt from 'react-ios-pwa-prompt';
import PWAUpdate from '@components/pwa-update';
import { Register } from './service-worker-registration';

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

const AppWrapper: React.FC = () => {
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistration>();

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <PWAUpdate registration={swRegistration} />
              <PWAPrompt appIconPath="favicon.ico" />
              <App />
              <ToastContainer />
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

const root = createRoot(document.getElementById('root')!);

root.render(<AppWrapper />);

// Register service worker for PWA functionality
Register({
  onSuccess: (registration) => {
    console.log('SW registered: ', registration);
  },
  onUpdate: (registration) => {
    console.log('SW updated: ', registration);
    // Show update notification to user
    window.dispatchEvent(
      new CustomEvent('sw-update', { detail: registration }),
    );
  },
});
