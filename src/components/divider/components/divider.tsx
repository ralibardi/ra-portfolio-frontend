import classNames from 'classnames';
import React, { type FunctionComponent } from 'react';
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
    return <hr className={classNames(styles.vDivider, className)} aria-orientation="vertical" />;
  }

  return (
    <div className={classNames(styles.hDivider, className)}>
      <hr aria-orientation="horizontal" />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default React.memo(Divider);
