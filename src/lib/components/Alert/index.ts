/**
 * Alert Component
 *
 * Exports Alert and Notification components for displaying feedback messages.
 *
 * @module lib/components/Alert
 */

export type {
  AddNotificationOptions,
  AlertProps,
  NotificationContainerProps,
  NotificationContextValue,
  NotificationItem,
  NotificationPosition,
  NotificationProps,
  NotificationProviderProps,
  Severity,
} from '../types';
export { default as Alert } from './components/Alert';
export { default as Notification } from './components/Notification';
export { default as NotificationContainer } from './components/NotificationContainer';
export { NotificationProvider, useNotifications } from './contexts/NotificationContext';
