import React, { FunctionComponent, useCallback, useMemo } from 'react';
import cn from 'classnames';
import { IToggleWithIconsProps } from '../../types/toggle-with-icons-props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { spring } from '@utils/animations/framer-motion-animation';
import styles from '../../assets/toggle-with-icons.module.scss';

const ToggleWithIcons: FunctionComponent<IToggleWithIconsProps> = ({
  iconLeft,
  iconRight,
  checked = false,
  onClick,
}) => {
  const toggleSwitch = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick && onClick(event);
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
