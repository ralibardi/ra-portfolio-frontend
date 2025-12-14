import cn from 'classnames';
import { memo, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { NotificationProps, Severity } from '../../types';
import styles from '../assets/Notification.module.scss';

/**
 * Default icons for each severity level
 */
const SeverityIcons: Record<Severity, React.ReactNode> = {
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={styles.icon}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={styles.icon}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={styles.icon}
    >
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={styles.icon}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
};

/**
 * Notification Component
 *
 * Displays toast-style notifications with auto-dismiss functionality.
 * Supports enter/exit animations and multiple severity levels.
 *
 * @example
 * ```tsx
 * <Notification
 *   severity="success"
 *   title="Saved!"
 *   message="Your changes have been saved."
 *   duration={5000}
 *   onClose={handleClose}
 * />
 * ```
 */
const Notification = memo(function Notification({
  title,
  message,
  severity,
  duration = 5000,
  onClose,
}: NotificationProps) {
  const notificationId = useId();
  const titleId = title ? `${notificationId}-title` : undefined;
  const descriptionId = `${notificationId}-description`;
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    setIsExiting(true);
  }, []);

  // Handle animation end for exit
  const handleAnimationEnd = useCallback(() => {
    if (isExiting && onClose) {
      onClose();
    }
  }, [isExiting, onClose]);

  // Auto-dismiss timer
  useEffect(() => {
    if (duration && duration > 0) {
      timerRef.current = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
    return undefined;
  }, [duration, handleClose]);

  // Pause timer on hover
  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Resume timer on mouse leave
  const handleMouseLeave = useCallback(() => {
    if (duration && duration > 0 && !isExiting) {
      timerRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }
  }, [duration, isExiting, handleClose]);

  return (
    <div
      className={cn(styles.notification, styles[severity], {
        [styles.exiting]: isExiting,
      })}
      role="status"
      aria-live="polite"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-testid="notification"
      data-severity={severity}
      onAnimationEnd={handleAnimationEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.iconContainer}>{SeverityIcons[severity]}</div>

      <div className={styles.content}>
        {title && (
          <h4 id={titleId} className={styles.title}>
            {title}
          </h4>
        )}
        <p id={descriptionId} className={styles.message}>
          {message}
        </p>
      </div>

      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close notification"
          data-testid="notification-close-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={styles.closeIcon}
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      )}
    </div>
  );
});

Notification.displayName = 'Notification';

export default Notification;
