import classNames from 'classnames';
import React, { type FunctionComponent, type PropsWithChildren } from 'react';
import styles from '../assets/badge.module.scss';

export type BadgeProps = {
  className?: string;
  variant?: 'primary' | 'secondary' | 'neutral';
  size?: 'sm' | 'md';
};

const Badge: FunctionComponent<PropsWithChildren<BadgeProps>> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
}) => {
  return (
    <span className={classNames(styles.badge, styles[variant], styles[size], className)}>
      {children}
    </span>
  );
};

export default React.memo(Badge);
