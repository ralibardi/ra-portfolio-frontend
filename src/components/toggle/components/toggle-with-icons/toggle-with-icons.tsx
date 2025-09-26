import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import React, { type FunctionComponent, useCallback, useMemo } from 'react';
import styles from '../../assets/toggle-with-icons.module.scss';
import type { IToggleWithIconsProps } from '../../types/toggle-with-icons-props';

const ToggleWithIcons: FunctionComponent<IToggleWithIconsProps> = ({
  iconLeft,
  iconRight,
  checked = false,
  onClick,
}) => {
  const toggleSwitch = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
    },
    [onClick],
  );

  const iconLeftClassName = useMemo(
    () => cn(styles.iconLeft, { [styles.disabled]: !checked }),
    [checked],
  );
  const iconRightClassName = useMemo(
    () => cn(styles.iconRight, { [styles.disabled]: checked }),
    [checked],
  );

  return (
    <button
      type="button"
      className={styles.toggle}
      data-ison={checked}
      onClick={toggleSwitch}
      data-testid="toggle-container"
    >
      {iconLeft && (
        <FontAwesomeIcon
          icon={iconLeft}
          className={iconLeftClassName}
          data-testid="toggle-icon-left"
        />
      )}
      <div className={styles.switch} data-testid="toggle-switch" />
      {iconRight && (
        <FontAwesomeIcon
          icon={iconRight}
          className={iconRightClassName}
          data-testid="toggle-icon-right"
        />
      )}
    </button>
  );
};

export default React.memo(ToggleWithIcons);
