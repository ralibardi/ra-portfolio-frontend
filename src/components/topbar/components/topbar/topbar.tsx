'use client';

import { usePathname } from 'next/navigation';
import { memo, useMemo } from 'react';
import styles from '../../assets/topbar.module.scss';
import type { ITopbarProps } from '../../types/topbar-props';
import NavLink from '../nav-link/nav-link';

const Topbar = memo(function Topbar({ routes }: ITopbarProps) {
  const pathname = usePathname();

  const navLinks = useMemo(() => {
    if (!routes?.length) {
      return null;
    }

    return routes.map((route) => (
      <NavLink
        key={route.path}
        route={route}
        isActive={pathname === route.path}
        data-testid="topbar-nav-link"
      />
    ));
  }, [routes, pathname]);

  if (!navLinks) {
    return null;
  }

  return (
    <nav className={styles.container} data-testid="topbar-container">
      {routes.length > 0 && <div className={styles.padding}>{navLinks}</div>}
    </nav>
  );
});

export default Topbar;
