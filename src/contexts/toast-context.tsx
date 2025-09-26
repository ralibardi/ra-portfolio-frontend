import type React from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  durationMs: number;
}

type ShowToast = (
  message: string,
  options?: Partial<Pick<ToastItem, 'type' | 'durationMs'>>,
) => void;

interface ToastContextValue {
  showToast: ShowToast;
  success: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
  info: (message: string, durationMs?: number) => void;
  toasts: readonly ToastItem[];
  remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idCounter = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast: ShowToast = useCallback(
    (message, options) => {
      const id = String(++idCounter.current);
      const type: ToastType = options?.type ?? 'info';
      const durationMs = options?.durationMs ?? 3000;
      const toast: ToastItem = { id, message, type, durationMs };
      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => remove(id), durationMs);
    },
    [remove],
  );

  const api = useMemo<ToastContextValue>(
    () => ({
      showToast,
      success: (message, durationMs) => showToast(message, { type: 'success', durationMs }),
      error: (message, durationMs) => showToast(message, { type: 'error', durationMs }),
      info: (message, durationMs) => showToast(message, { type: 'info', durationMs }),
      toasts,
      remove,
    }),
    [remove, showToast, toasts],
  );

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>;
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

export default ToastContext;
