import React, { FunctionComponent, useMemo } from 'react';
import cn from 'classnames';
import { IToggleSwitcherProps } from '../../types/toggle-switcher-props';

import styles from '../../assets/toggle-switcher.module.scss';

const ToggleSwitcher: FunctionComponent<IToggleSwitcherProps> = ({
  checked,
  onChange,
  invertedIconLogic = false,
}) => {
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
      htmlFor="toggle-input"
      id="toggle-switcher"
      aria-label="Dark mode toggle"
    >
      <input
        type="checkbox"
        id="toggle-input"
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
