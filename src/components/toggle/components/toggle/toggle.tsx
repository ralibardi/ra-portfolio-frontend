import React, { FunctionComponent, useCallback } from 'react';
import { IToggleProps } from '../../types/toggle-props';
import { motion } from 'framer-motion';
import { spring } from '@utils/animations/framer-motion-animation';

import styles from '../../assets/toggle.module.scss';

const Toggle: FunctionComponent<IToggleProps> = ({
  checked = false,
  onClick,
}) => {
  const toggleSwitch = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick(event);
    },
    [onClick],
  );

  return (
    <button
      className={styles.toggle}
      data-ison={checked}
      onClick={toggleSwitch}
      data-testid="toggle-container"
    >
      <motion.div
        className={styles.switch}
        data-testid="toggle-switch"
        layout
        transition={spring}
      />
    </button>
  );
};

export default Toggle;
