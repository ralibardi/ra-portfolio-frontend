import type IRoute from '@type/route';
import React, { type FunctionComponent, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../../assets/topbar.module.scss';
import type { ITopbarProps } from '../../types/topbar-props';
import NavLink from '../nav-link/nav-link';

const Topbar: FunctionComponent<ITopbarProps> = ({ routes }) => {
  const location = useLocation();

  const navLinks = useMemo(() => {
    return routes?.map((route: IRoute) => (
      <NavLink
        key={route.path}
        route={route}
        isActive={location.pathname === route.path}
        data-testid="topbar-nav-link"
      />
    ));
  }, [routes, location.pathname]);

  return (
    <nav className={styles.container} data-testid="topbar-container">
      {routes && routes.length > 1 && <div className={styles.padding}>{navLinks}</div>}
    </nav>
  );
};

export default React.memo(Topbar);
