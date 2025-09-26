import Loading from '@components/loading';
import type React from 'react';
import { memo, useCallback, useId } from 'react';
import styles from '../../assets/primary-button.module.scss';
import type { IPrimaryButtonProps } from '../../types/primary-button-props';

const PrimaryButton = memo(function PrimaryButton({
  onClick,
  label,
  isLoading,
  ...props
}: IPrimaryButtonProps) {
  const buttonId = useId();
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        e.preventDefault();
        if (!isLoading) {
          onClick(e);
        }
      }
      // If no onClick handler, let the default behavior happen (form submission)
    },
    [isLoading, onClick],
  );

  return (
    <button
      className={styles.button}
      data-testid="primary-button-container"
      id={buttonId}
      type="button"
      {...props}
      onClick={handleClick}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.content}>
          <span className={styles.label} data-testid="primary-button-label">
            {label}
          </span>
        </div>
      )}
    </button>
  );
});

export default PrimaryButton;
