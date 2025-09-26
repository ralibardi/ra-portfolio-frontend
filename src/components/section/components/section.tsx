import classNames from 'classnames';
import React, { type FunctionComponent, type PropsWithChildren } from 'react';
import styles from '../assets/section.module.scss';

export type SectionProps = {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
  title?: string;
  subtitle?: string;
};

const Section: FunctionComponent<PropsWithChildren<SectionProps>> = ({
  as = 'section',
  className,
  spacing = 'md',
  title,
  subtitle,
  children,
}) => {
  const Component = as as unknown as React.ElementType;
  return (
    <Component className={classNames(styles.section, styles[`spacing-${spacing}`], className)}>
      {(title || subtitle) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
      )}
      {children}
    </Component>
  );
};

export default React.memo(Section);
