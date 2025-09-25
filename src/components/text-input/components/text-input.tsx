import React, { FunctionComponent, InputHTMLAttributes, useId } from 'react';
import classNames from 'classnames';
import styles from '../assets/text-input.module.scss';

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
};

const TextInput: FunctionComponent<TextInputProps> = ({
  id,
  label,
  error,
  helperText,
  className,
  fullWidth = true,
  ...props
}) => {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div
      className={classNames(styles.container, className)}
      data-fullwidth={fullWidth}
    >
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={classNames(styles.input, {
          [styles.inputError]: Boolean(error),
        })}
        aria-invalid={Boolean(error)}
        aria-describedby={helperText || error ? `${inputId}-helper` : undefined}
        {...props}
      />
      {(helperText || error) && (
        <div
          id={`${inputId}-helper`}
          className={classNames(styles.helper, {
            [styles.error]: Boolean(error),
          })}
        >
          {error ?? helperText}
        </div>
      )}
    </div>
  );
};

export default React.memo(TextInput);
