import classNames from 'classnames';
import React, { type FunctionComponent, type TextareaHTMLAttributes, useId } from 'react';
import styles from '../assets/text-area.module.scss';

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
};

const TextArea: FunctionComponent<TextAreaProps> = ({
  id,
  label,
  error,
  helperText,
  className,
  fullWidth = true,
  rows = 4,
  ...props
}) => {
  const autoId = useId();
  const textAreaId = id ?? autoId;

  return (
    <div className={classNames(styles.container, className)} data-fullwidth={fullWidth}>
      {label && (
        <label className={styles.label} htmlFor={textAreaId}>
          {label}
        </label>
      )}
      <textarea
        id={textAreaId}
        rows={rows}
        className={classNames(styles.textarea, {
          [styles.textareaError]: Boolean(error),
        })}
        aria-invalid={Boolean(error)}
        aria-describedby={helperText || error ? `${textAreaId}-helper` : undefined}
        {...props}
      />
      {(helperText || error) && (
        <div
          id={`${textAreaId}-helper`}
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

export default React.memo(TextArea);
