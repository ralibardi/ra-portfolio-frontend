import React, {
  CSSProperties,
  FunctionComponent,
  PropsWithChildren,
} from 'react';
import classNames from 'classnames';
import styles from '../assets/grid.module.scss';

export type GridProps = {
  className?: string;
  columns?: number; // default mobile/tablet
  columnsMd?: number; // >= tablet
  columnsLg?: number; // >= laptop
  gap?: 'sm' | 'md' | 'lg' | 'xl';
};

const Grid: FunctionComponent<PropsWithChildren<GridProps>> = ({
  className,
  columns = 2,
  columnsMd,
  columnsLg,
  gap = 'md',
  children,
}) => {
  const styleVars: CSSProperties & Record<string, string> = {
    '--columns': String(columns),
  };
  if (columnsMd) styleVars['--columnsMd'] = String(columnsMd);
  if (columnsLg) styleVars['--columnsLg'] = String(columnsLg);

  return (
    <div
      className={classNames(styles.grid, className)}
      style={styleVars}
      data-gap={gap}
    >
      {children}
    </div>
  );
};

export default React.memo(Grid);
