import cn from 'classnames';
import { memo, useCallback, useId, useMemo } from 'react';
import type { RadioProps } from '../../types';
import styles from '../assets/Radio.module.scss';

/**
 * Radio Component
 *
 * An accessible radio button with label support.
 * Should be used within a RadioGroup for proper state management.
 *
 * @example
 * ```tsx
 * <Radio
 *   label="Option A"
 *   value="a"
 *   checked={selected === 'a'}
 *   onChange={setSelected}
 *   name="options"
 * />
 * ```
 */
const Radio = memo(function Radio({
  label,
  value,
  checked,
  onChange,
  name,
  disabled = false,
  id: providedId,
}: RadioProps) {
  const generatedId = useId();
  const radioId = providedId ?? generatedId;

  // Build class names
  const radioClasses = useMemo(() => {
    return cn(styles.radio, {
      [styles['radio--checked']]: checked,
      [styles['radio--disabled']]: disabled,
    });
  }, [checked, disabled]);

  const wrapperClasses = useMemo(() => {
    return cn(styles.wrapper, {
      [styles['wrapper--disabled']]: disabled,
    });
  }, [disabled]);

  const handleChange = useCallback(() => {
    if (!disabled) {
      onChange(value);
    }
  }, [disabled, onChange, value]);

  return (
    <label className={wrapperClasses} data-testid="radio-wrapper">
      <input
        id={radioId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.input}
        data-testid="radio-input"
      />
      <span className={radioClasses} aria-hidden="true">
        {checked && <span className={styles.dot} />}
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
});

Radio.displayName = 'Radio';

export default Radio;
