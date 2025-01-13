import React, { memo, useCallback } from 'react';
import Loading from '@components/loading';
import { IButtonWithIconProps } from '../../types/button-with-icon-props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../../assets/button-with-icon.module.scss';

const ButtonWithIcon = memo(function ButtonWithIcon({
  icon,
  onClick,
  label,
  isLoading,
  ...props
}: IButtonWithIconProps) {
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
      data-testid="button-with-icon-container"
      id="button-with-icon"
      type="button"
      {...props}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loading size="auto" />
      ) : (
        <div
          className={styles.content}
          data-testid="button-with-icon-label-container"
        >
          <FontAwesomeIcon
            icon={icon}
            className={styles.icon}
            data-testid="button-with-icon-icon"
          />
          {label && (
            <span className={styles.label} data-testid="button-with-icon-label">
              {label}
            </span>
          )}
        </div>
      )}
    </button>
  );
});

export default ButtonWithIcon;
