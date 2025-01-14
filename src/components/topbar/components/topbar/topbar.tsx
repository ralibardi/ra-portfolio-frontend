import React, { FunctionComponent, useMemo } from 'react';
import IRoute from '@type/route';
import { useLocation } from 'react-router-dom';
import NavLink from '../nav-link/nav-link';
import { ITopbarProps } from '../../types/topbar-props';

import styles from '../../assets/topbar.module.scss';

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
      {routes && routes.length > 1 && (
        <div className={styles.padding}>{navLinks}</div>
      )}
    </nav>
  );
};

export default React.memo(Topbar);
