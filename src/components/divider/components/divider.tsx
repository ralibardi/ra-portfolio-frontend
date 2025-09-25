import React, { FunctionComponent } from 'react';
import classNames from 'classnames';
import styles from '../assets/divider.module.scss';

export type DividerProps = {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
};

const Divider: FunctionComponent<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className,
}) => {
  if (orientation === 'vertical') {
    return (
      <span
        className={classNames(styles.vDivider, className)}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  return (
    <div
      className={classNames(styles.hDivider, className)}
      role="separator"
      aria-orientation="horizontal"
    >
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default React.memo(Divider);
