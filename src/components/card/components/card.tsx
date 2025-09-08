import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import styles from '../assets/card.module.scss';

export type CardProps = {
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  elevated?: boolean;
  interactive?: boolean;
  as?: keyof JSX.IntrinsicElements;
};

const Card: FunctionComponent<PropsWithChildren<CardProps>> = ({
  className,
  header,
  footer,
  elevated = false,
  interactive = false,
  as = 'article',
  children,
}) => {
  const Component = as as unknown as React.ElementType;
  return (
    <Component
      className={classNames(
        styles.card,
        { [styles.elevated]: elevated, [styles.interactive]: interactive },
        className,
      )}
    >
      {header && <div className={styles.header}>{header}</div>}
      {children}
      {footer && <div className={styles.footer}>{footer}</div>}
    </Component>
  );
};

export default React.memo(Card);
