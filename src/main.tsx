import App from '@app/app';
import ErrorBoundary from '@components/error-boundary';
import PWAUpdate from '@components/pwa-update';
import ToastContainer from '@components/toast';
import { ThemeProvider } from '@contexts/theme-context';
import { ToastProvider } from '@contexts/toast-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PWAPrompt from 'react-ios-pwa-prompt';
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
  const [swRegistration, _setSwRegistration] = useState<ServiceWorkerRegistration>();

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

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = createRoot(rootElement);

root.render(<AppWrapper />);

// Register service worker for PWA functionality
Register({
  onSuccess: (_registration) => {
    // Service worker registered successfully
  },
  onUpdate: (registration) => {
    // Show update notification to user
    window.dispatchEvent(new CustomEvent('sw-update', { detail: registration }));
  },
});
