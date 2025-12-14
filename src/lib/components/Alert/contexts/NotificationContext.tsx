import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { NotificationPosition, Severity } from '../../types';

/**
 * Internal notification type with unique ID
 */
export interface NotificationItem {
  id: string;
  title?: string;
  message: string;
  severity: Severity;
  duration?: number;
}

/**
 * Options for adding a notification
 */
export interface AddNotificationOptions {
  title?: string;
  message: string;
  severity: Severity;
  duration?: number;
}

/**
 * Notification context value
 */
export interface NotificationContextValue {
  notifications: NotificationItem[];
  addNotification: (options: AddNotificationOptions) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

/**
 * Notification container context value
 */
export interface NotificationContainerContextValue {
  position: NotificationPosition;
  maxNotifications: number;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);
const NotificationContainerContext = createContext<NotificationContainerContextValue | null>(null);

/**
 * Generate unique ID for notifications
 */
let notificationIdCounter = 0;
const generateId = (): string => {
  notificationIdCounter += 1;
  return `notification-${notificationIdCounter}-${Date.now()}`;
};

/**
 * NotificationProvider Props
 */
export interface NotificationProviderProps {
  children: React.ReactNode;
  position?: NotificationPosition;
  maxNotifications?: number;
}

/**
 * NotificationProvider Component
 *
 * Provides notification context for managing toast notifications globally.
 *
 * @example
 * ```tsx
 * <NotificationProvider position="top-right" maxNotifications={5}>
 *   <App />
 * </NotificationProvider>
 * ```
 */
export function NotificationProvider({
  children,
  position = 'top-right',
  maxNotifications = 5,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback(
    (options: AddNotificationOptions): string => {
      const id = generateId();
      const newNotification: NotificationItem = {
        id,
        ...options,
      };

      setNotifications((prev) => {
        const updated = [...prev, newNotification];
        // Limit to maxNotifications, removing oldest first
        if (updated.length > maxNotifications) {
          return updated.slice(-maxNotifications);
        }
        return updated;
      });

      return id;
    },
    [maxNotifications],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearAll,
    }),
    [notifications, addNotification, removeNotification, clearAll],
  );

  const containerContextValue = useMemo(
    () => ({
      position,
      maxNotifications,
    }),
    [position, maxNotifications],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      <NotificationContainerContext.Provider value={containerContextValue}>
        {children}
      </NotificationContainerContext.Provider>
    </NotificationContext.Provider>
  );
}

/**
 * Hook to access notification context
 *
 * @example
 * ```tsx
 * const { addNotification, removeNotification } = useNotifications();
 *
 * const handleSuccess = () => {
 *   addNotification({
 *     severity: 'success',
 *     title: 'Saved!',
 *     message: 'Your changes have been saved.',
 *     duration: 5000,
 *   });
 * };
 * ```
 */
export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

/**
 * Hook to access notification container context (internal use)
 */
export function useNotificationContainer(): NotificationContainerContextValue {
  const context = useContext(NotificationContainerContext);
  if (!context) {
    throw new Error('useNotificationContainer must be used within a NotificationProvider');
  }
  return context;
}
