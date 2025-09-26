import type React from 'react';
import { type FunctionComponent, useCallback } from 'react';
import styles from '../../assets/toggle.module.scss';
import type { IToggleProps } from '../../types/toggle-props';

const Toggle: FunctionComponent<IToggleProps> = ({ checked = false, onClick }) => {
  const toggleSwitch = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick(event);
    },
    [onClick],
  );

  return (
    <button
      type="button"
      className={styles.toggle}
      data-ison={checked}
      onClick={toggleSwitch}
      data-testid="toggle-container"
    >
      <div className={styles.switch} data-testid="toggle-switch" />
    </button>
  );
};

export default Toggle;
