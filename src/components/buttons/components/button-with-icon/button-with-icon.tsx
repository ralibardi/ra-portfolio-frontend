import Loading from '@components/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type React from 'react';
import { memo, useCallback, useId, useMemo } from 'react';
import styles from '../../assets/button-with-icon.module.scss';
import type { IButtonWithIconProps } from '../../types/button-with-icon-props';

const ButtonWithIcon = memo(function ButtonWithIcon({
  icon,
  onClick,
  label,
  isLoading,
  size = 'medium',
  className,
  ...props
}: IButtonWithIconProps) {
  const buttonId = useId();

  const buttonClasses = useMemo(() => {
    const classes = [styles.button];
    if (size === 'small') classes.push(styles.small);
    if (size === 'large') classes.push(styles.large);
    if (className) classes.push(className);
    return classes.join(' ');
  }, [size, className]);

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
      className={buttonClasses}
      data-testid="button-with-icon-container"
      id={buttonId}
      type="button"
      {...props}
      onClick={handleClick}
      disabled={isLoading || props.disabled}
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
