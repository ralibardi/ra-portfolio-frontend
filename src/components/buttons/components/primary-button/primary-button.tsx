import React, { memo, useCallback } from 'react';
import Loading from '@components/loading';
import { IPrimaryButtonProps } from '../../types/primary-button-props';

import styles from '../../assets/primary-button.module.scss';

const PrimaryButton = memo(function PrimaryButton({
  onClick,
  label,
  isLoading,
  ...props
}: IPrimaryButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!isLoading && onClick) {
        onClick(e);
      }
    },
    [isLoading, onClick],
  );

  return (
    <button
      className={styles.button}
      data-testid="primary-button-container"
      id="primary-button"
      type="button"
      {...props}
      onClick={handleClick}
      disabled={isLoading}
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
