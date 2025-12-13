import cn from 'classnames';
import { memo, useEffect, useId, useMemo, useRef } from 'react';
import type { CheckboxProps } from '../../types';
import styles from '../assets/Checkbox.module.scss';

/**
 * Checkbox Component
 *
 * An accessible checkbox with label support and indeterminate state.
 * Follows WCAG 2.1 AA standards with proper label association and ARIA attributes.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Checkbox
 *   label="Accept terms and conditions"
 *   checked={accepted}
 *   onChange={setAccepted}
 *   required
 * />
 *
 * // Indeterminate state (for "select all" scenarios)
 * <Checkbox
 *   label="Select all items"
 *   checked={allSelected}
 *   onChange={handleSelectAll}
 *   indeterminate={someSelected && !allSelected}
 * />
 * ```
 */
const Checkbox = memo(function Checkbox({
  label,
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  required = false,
  error,
  id: providedId,
  'aria-describedby': ariaDescribedBy,
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = providedId ?? generatedId;
  const errorId = `${checkboxId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);

  // Set indeterminate state via ref (can't be set via attribute)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  // Determine which IDs to use for aria-describedby
  const describedByIds = useMemo(() => {
    const ids: string[] = [];
    if (ariaDescribedBy) ids.push(ariaDescribedBy);
    if (error) ids.push(errorId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [ariaDescribedBy, error, errorId]);

  // Build class names
  const containerClasses = useMemo(() => {
    return cn(styles.container, {
      [styles['container--error']]: !!error,
      [styles['container--disabled']]: disabled,
    });
  }, [error, disabled]);

  const checkboxClasses = useMemo(() => {
    return cn(styles.checkbox, {
      [styles['checkbox--checked']]: checked,
      [styles['checkbox--indeterminate']]: indeterminate,
      [styles['checkbox--error']]: !!error,
      [styles['checkbox--disabled']]: disabled,
    });
  }, [checked, indeterminate, error, disabled]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className={containerClasses} data-testid="checkbox-container">
      <label className={styles.wrapper}>
        <input
          ref={inputRef}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedByIds}
          aria-required={required}
          className={styles.input}
          data-testid="checkbox-input"
        />
        <span className={checkboxClasses} aria-hidden="true">
          {checked && !indeterminate && (
            <svg
              className={styles.checkIcon}
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {indeterminate && (
            <svg
              className={styles.indeterminateIcon}
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </span>
        <span className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </span>
      </label>
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
