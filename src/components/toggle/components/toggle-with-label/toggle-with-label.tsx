import React, { FunctionComponent, useCallback } from 'react';
import { IToggleWithLabelProps } from '../../types/toggle-with-label-props';
import { motion } from 'framer-motion';
import { spring } from '@utils/animations/framer-motion-animation';

import styles from '../../assets/toggle-with-label.module.scss';

const ToggleWithLabel: FunctionComponent<IToggleWithLabelProps> = ({
  label,
  checked = false,
  onClick,
}) => {
  const toggleSwitch = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
    },
    [onClick],
  );

  return (
    <div className={styles.container} data-testid="toggle-container">
      <label className={styles.label} data-testid="toggle-label">
        {label}
      </label>
      <button
        className={styles.toggle}
        data-ison={checked}
        onClick={toggleSwitch}
        data-testid="toggle-switch-container"
      >
        <div className={styles.switch} data-testid="toggle-switch" />
      </button>
    </div>
  );
};

export default ToggleWithLabel;
