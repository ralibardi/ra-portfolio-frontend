import cn from 'classnames';
import { memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { NotificationContainerProps } from '../../types';
import styles from '../assets/NotificationContainer.module.scss';
import { useNotificationContainer, useNotifications } from '../contexts/NotificationContext';
import Notification from './Notification';

/**
 * NotificationContainer Component
 *
 * Renders a container for managing and displaying notification stack.
 * Must be used within a NotificationProvider.
 *
 * @example
 * ```tsx
 * <NotificationProvider position="top-right" maxNotifications={5}>
 *   <App />
 *   <NotificationContainer />
 * </NotificationProvider>
 * ```
 */
const NotificationContainer = memo(function NotificationContainer({
  position: positionProp,
  maxNotifications: maxNotificationsProp,
}: NotificationContainerProps) {
  const { notifications, removeNotification } = useNotifications();
  const containerContext = useNotificationContainer();

  // Use props if provided, otherwise fall back to context
  const position = positionProp ?? containerContext.position;
  const maxNotifications = maxNotificationsProp ?? containerContext.maxNotifications;

  // Limit displayed notifications
  const displayedNotifications = notifications.slice(-maxNotifications);

  const handleClose = useCallback(
    (id: string) => {
      removeNotification(id);
    },
    [removeNotification],
  );

  if (displayedNotifications.length === 0) {
    return null;
  }

  const containerContent = (
    <div
      className={cn(styles.container, styles[position.replace('-', '')])}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      data-testid="notification-container"
      data-position={position}
    >
      {displayedNotifications.map((notification) => (
        <Notification
          key={notification.id}
          title={notification.title}
          message={notification.message}
          severity={notification.severity}
          duration={notification.duration}
          onClose={() => handleClose(notification.id)}
        />
      ))}
    </div>
  );

  // Render in portal for proper z-index stacking
  return createPortal(containerContent, document.body);
});

NotificationContainer.displayName = 'NotificationContainer';

export default NotificationContainer;
