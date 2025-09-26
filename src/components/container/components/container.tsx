import classNames from 'classnames';
import React, { type FunctionComponent, type PropsWithChildren } from 'react';
import styles from '../assets/container.module.scss';

export type ContainerProps = {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  padded?: boolean;
};

const Container: FunctionComponent<PropsWithChildren<ContainerProps>> = ({
  as = 'div',
  className,
  children,
  maxWidth = 'lg',
  padded = true,
}) => {
  const Component = as as unknown as React.ElementType;
  return (
    <Component
      className={classNames(
        styles.container,
        styles[maxWidth],
        { [styles.padded]: padded },
        className,
      )}
    >
      {children}
    </Component>
  );
};

export default React.memo(Container);
