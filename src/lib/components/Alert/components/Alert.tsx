import cn from 'classnames';
import { memo, useId } from 'react';
import type { AlertProps, Severity } from '../../types';
import styles from '../assets/Alert.module.scss';

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
 * Alert Component
 *
 * Displays feedback messages with appropriate severity levels.
 * Supports dismissible alerts with close button and custom icons.
 *
 * @example
 * ```tsx
 * <Alert severity="success" title="Success!">
 *   Your changes have been saved.
 * </Alert>
 *
 * <Alert severity="error" onClose={handleClose}>
 *   An error occurred. Please try again.
 * </Alert>
 * ```
 */
const Alert = memo(function Alert({
  title,
  children,
  severity,
  onClose,
  icon,
  role = severity === 'error' || severity === 'warning' ? 'alert' : 'status',
}: AlertProps) {
  const alertId = useId();
  const titleId = title ? `${alertId}-title` : undefined;

  const displayIcon = icon !== undefined ? icon : SeverityIcons[severity];

  return (
    <div
      className={cn(styles.alert, styles[severity])}
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      data-testid="alert"
      data-severity={severity}
    >
      {displayIcon && <div className={styles.iconContainer}>{displayIcon}</div>}

      <div className={styles.content}>
        {title && (
          <h3 id={titleId} className={styles.title}>
            {title}
          </h3>
        )}
        <div className={styles.message}>{children}</div>
      </div>

      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close alert"
          data-testid="alert-close-button"
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

Alert.displayName = 'Alert';

export default Alert;
