import cn from 'classnames';
import { memo, useId, useMemo } from 'react';
import type { InputProps } from '../../types';
import styles from '../assets/Input.module.scss';

/**
 * Input Component
 *
 * An accessible input field with label, placeholder, helper text, and error state support.
 * Follows WCAG 2.1 AA standards with proper label association and ARIA attributes.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input
 *   label="Email"
 *   value={email}
 *   onChange={setEmail}
 *   placeholder="Enter your email"
 * />
 *
 * // With error state
 * <Input
 *   label="Password"
 *   type="password"
 *   value={password}
 *   onChange={setPassword}
 *   error="Password must be at least 8 characters"
 *   required
 * />
 * ```
 */
const Input = memo(function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  helperText,
  error,
  disabled = false,
  required = false,
  id: providedId,
  'aria-describedby': ariaDescribedBy,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = providedId ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  // Determine which IDs to use for aria-describedby
  const describedByIds = useMemo(() => {
    const ids: string[] = [];
    if (ariaDescribedBy) ids.push(ariaDescribedBy);
    if (error) ids.push(errorId);
    else if (helperText) ids.push(helperId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [ariaDescribedBy, error, errorId, helperText, helperId]);

  // Build class names
  const containerClasses = useMemo(() => {
    return cn(styles.container, {
      [styles['container--error']]: !!error,
      [styles['container--disabled']]: disabled,
    });
  }, [error, disabled]);

  const inputClasses = useMemo(() => {
    return cn(styles.input, {
      [styles['input--error']]: !!error,
      [styles['input--disabled']]: disabled,
    });
  }, [error, disabled]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={containerClasses} data-testid="input-container">
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedByIds}
        aria-required={required}
        className={inputClasses}
        data-testid="input"
        {...props}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={helperId} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
