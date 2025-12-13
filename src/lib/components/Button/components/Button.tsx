import cn from 'classnames';
import { memo, useCallback, useId, useMemo, useRef, useState } from 'react';
import type { ButtonProps } from '../../types';
import styles from '../assets/Button.module.scss';

/**
 * Button Component
 *
 * A unified button component with multiple variants, sizes, and automatic
 * async operation handling. Supports icons, loading states, and full width mode.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button variant="primary" onClick={handleClick}>Click me</Button>
 *
 * // With icon
 * <Button variant="secondary" icon={<Icon />} iconPosition="left">
 *   With Icon
 * </Button>
 *
 * // Async operation with automatic loading
 * <Button onClick={async () => await saveData()}>Save</Button>
 * ```
 */
const Button = memo(function Button({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  isLoading: controlledLoading,
  disabled = false,
  onClick,
  onAsyncError,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const buttonId = useId();
  const [internalLoading, setInternalLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dimensionsRef = useRef<{ width: number; height: number } | null>(null);

  // Use controlled loading if provided, otherwise use internal state
  const isLoading = controlledLoading ?? internalLoading;

  // Determine if this is an icon-only button
  const isIconOnly = icon && !children;

  // Build class names
  const buttonClasses = useMemo(() => {
    return cn(
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      {
        [styles['button--fullWidth']]: fullWidth,
        [styles['button--loading']]: isLoading,
        [styles['button--iconOnly']]: isIconOnly,
        [styles['button--disabled']]: disabled || isLoading,
      },
      className,
    );
  }, [variant, size, fullWidth, isLoading, isIconOnly, disabled, className]);

  // Store button dimensions for loading state
  const storeDimensions = useCallback(() => {
    if (buttonRef.current && !dimensionsRef.current) {
      dimensionsRef.current = {
        width: buttonRef.current.offsetWidth,
        height: buttonRef.current.offsetHeight,
      };
    }
  }, []);

  // Handle async result from onClick
  const handleAsyncResult = useCallback(
    async (result: Promise<void>) => {
      if (controlledLoading === undefined) {
        setInternalLoading(true);
      }
      try {
        await result;
      } catch (error) {
        if (onAsyncError && error instanceof Error) {
          onAsyncError(error);
        }
      } finally {
        if (controlledLoading === undefined) {
          setInternalLoading(false);
        }
      }
    },
    [controlledLoading, onAsyncError],
  );

  // Handle click with async detection
  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading || !onClick) {
        return;
      }

      storeDimensions();

      try {
        const result = onClick(event);
        if (result instanceof Promise) {
          await handleAsyncResult(result);
        }
      } catch (error) {
        if (onAsyncError && error instanceof Error) {
          onAsyncError(error);
        }
      }
    },
    [disabled, isLoading, onClick, onAsyncError, storeDimensions, handleAsyncResult],
  );

  // Inline styles for dimension preservation during loading
  const inlineStyles = useMemo(() => {
    if (isLoading && dimensionsRef.current) {
      return {
        minWidth: dimensionsRef.current.width,
        minHeight: dimensionsRef.current.height,
      };
    }
    return undefined;
  }, [isLoading]);

  // Render spinner
  const renderSpinner = () => (
    <span
      className={cn(styles.spinner, {
        [styles[`spinner--${size}`]]: !isIconOnly,
        [styles['spinner--iconSize']]: isIconOnly,
      })}
      aria-hidden="true"
    />
  );

  // Render icon
  const renderIcon = () => {
    if (!icon) return null;

    return (
      <span
        className={cn(styles.icon, {
          [styles['icon--left']]: iconPosition === 'left' && children,
          [styles['icon--right']]: iconPosition === 'right' && children,
        })}
        aria-hidden="true"
      >
        {icon}
      </span>
    );
  };

  // Render content
  const renderContent = () => {
    if (isLoading) {
      return renderSpinner();
    }

    if (isIconOnly) {
      return renderIcon();
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        <span className={styles.label}>{children}</span>
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <button
      ref={buttonRef}
      id={buttonId}
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      onClick={handleClick}
      style={inlineStyles}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      data-testid="button"
      {...props}
    >
      <span className={styles.content}>{renderContent()}</span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
