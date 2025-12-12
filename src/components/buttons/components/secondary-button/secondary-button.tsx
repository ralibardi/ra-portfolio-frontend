import Loading from '@components/loading';
import type React from 'react';
import { memo, useCallback, useId, useMemo } from 'react';
import styles from '../../assets/secondary-button.module.scss';
import type { ISecondaryButtonProps } from '../../types/secondary-button-props';

const SecondaryButton = memo(function SecondaryButton({
  onClick,
  label,
  isLoading = false,
  size = 'medium',
  className,
  ...props
}: ISecondaryButtonProps) {
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
      if (onClick) {
        e.preventDefault();
        if (!isLoading) {
          onClick(e);
        }
      }
      // If no onClick handler, let the default behavior happen
    },
    [isLoading, onClick],
  );

  return (
    <button
      className={buttonClasses}
      data-testid="secondary-button-container"
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
          <span className={styles.label} data-testid="secondary-button-label">
            {label}
          </span>
        </div>
      )}
    </button>
  );
});

export default SecondaryButton;
