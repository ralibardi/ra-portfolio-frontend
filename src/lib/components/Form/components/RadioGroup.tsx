import cn from 'classnames';
import { memo, useId, useMemo } from 'react';
import type { RadioGroupProps } from '../../types';
import styles from '../assets/Radio.module.scss';
import Radio from './Radio';

/**
 * RadioGroup Component
 *
 * An accessible radio group that manages exclusive selection of radio buttons.
 * Follows WCAG 2.1 AA standards with proper ARIA attributes.
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   label="Select your preference"
 *   name="preference"
 *   value={preference}
 *   onChange={setPreference}
 *   options={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2' },
 *     { value: 'option3', label: 'Option 3', disabled: true },
 *   ]}
 *   required
 * />
 * ```
 */
const RadioGroup = memo(function RadioGroup({
  value,
  onChange,
  name,
  options,
  label,
  error,
  required = false,
  orientation = 'vertical',
}: RadioGroupProps) {
  const generatedId = useId();
  const groupId = `${generatedId}-group`;
  const errorId = `${generatedId}-error`;
  const labelId = `${generatedId}-label`;

  // Build class names
  const containerClasses = useMemo(() => {
    return cn(styles.group, {
      [styles['group--error']]: !!error,
    });
  }, [error]);

  const optionsClasses = useMemo(() => {
    return cn(styles.options, {
      [styles['options--horizontal']]: orientation === 'horizontal',
      [styles['options--vertical']]: orientation === 'vertical',
    });
  }, [orientation]);

  return (
    <fieldset
      id={groupId}
      className={containerClasses}
      aria-describedby={error ? errorId : undefined}
      data-required={required}
      data-testid="radiogroup-container"
    >
      {label && (
        <legend id={labelId} className={styles.groupLabel}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </legend>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        className={optionsClasses}
        data-testid="radiogroup-options"
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            name={name}
            disabled={option.disabled}
          />
        ))}
      </div>
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </fieldset>
  );
});

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
