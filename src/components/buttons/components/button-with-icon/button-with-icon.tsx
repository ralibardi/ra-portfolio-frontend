import Loading from '@components/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type React from 'react';
import { memo, useCallback, useId } from 'react';
import styles from '../../assets/button-with-icon.module.scss';
import type { IButtonWithIconProps } from '../../types/button-with-icon-props';

const ButtonWithIcon = memo(function ButtonWithIcon({
  icon,
  onClick,
  label,
  isLoading,
  ...props
}: IButtonWithIconProps) {
  const buttonId = useId();
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
      id={buttonId}
      type="button"
      {...props}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loading size="auto" />
      ) : (
        <div className={styles.content} data-testid="button-with-icon-label-container">
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
