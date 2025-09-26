import type React from 'react';
import { type FunctionComponent, useCallback, useId } from 'react';
import styles from '../../assets/toggle-with-label.module.scss';
import type { IToggleWithLabelProps } from '../../types/toggle-with-label-props';

const ToggleWithLabel: FunctionComponent<IToggleWithLabelProps> = ({
  label,
  checked = false,
  onClick,
}) => {
  const toggleId = useId();
  const toggleSwitch = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
    },
    [onClick],
  );

  return (
    <div className={styles.container} data-testid="toggle-container">
      <label className={styles.label} data-testid="toggle-label" htmlFor={toggleId}>
        {label}
      </label>
      <button
        type="button"
        id={toggleId}
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
