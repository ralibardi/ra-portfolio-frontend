/**
 * Alert Component
 *
 * Exports Alert and Notification components for displaying feedback messages.
 *
 * @module lib/components/Alert
 */

export { default as Alert } from './components/Alert';
export { default as Notification } from './components/Notification';
export { default as NotificationContainer } from './components/NotificationContainer';
export type {
  AddNotificationOptions,
  NotificationContextValue,
  NotificationItem,
  NotificationProviderProps,
} from './contexts/NotificationContext';
export { NotificationProvider, useNotifications } from './contexts/NotificationContext';
