import cn from 'classnames';
import React, { type FunctionComponent, useId, useMemo } from 'react';
import styles from '../../assets/toggle-switcher.module.scss';
import type { IToggleSwitcherProps } from '../../types/toggle-switcher-props';

const ToggleSwitcher: FunctionComponent<IToggleSwitcherProps> = ({
  checked,
  onChange,
  invertedIconLogic = false,
}) => {
  const toggleId = useId();
  const isChecked = useMemo(
    () => (invertedIconLogic ? !checked : checked),
    [checked, invertedIconLogic],
  );

  const containerClassName = useMemo(
    () =>
      cn(styles.container, {
        [styles.dark]: isChecked,
        [styles.light]: !isChecked,
      }),
    [isChecked],
  );

  return (
    <label
      className={containerClassName}
      data-testid="toggle-label"
      htmlFor={toggleId}
      id={`${toggleId}-label`}
      aria-label="Dark mode toggle"
    >
      <input
        type="checkbox"
        id={toggleId}
        data-testid="toggle-input"
        checked={isChecked}
        onChange={onChange}
        aria-label="Dark mode switcher"
        tabIndex={-1}
      />
      <div className={styles.toggle} />
    </label>
  );
};

export default React.memo(ToggleSwitcher);
