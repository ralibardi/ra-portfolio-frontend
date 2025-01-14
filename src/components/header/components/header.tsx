import React, { FunctionComponent, lazy, useMemo } from 'react';
import { getAppRoutes } from '@utils/get-app-routes';

const Topbar = lazy(() => import('@components/topbar'));
const CompanyInfo = lazy(() => import('@components/company-info'));
const ThemeToggle = lazy(() => import('@components/theme-toggle'));

import styles from '../assets/header.module.scss';

const Header: FunctionComponent = () => {
  const enabledRoutes = useMemo(
    () => getAppRoutes.filter((r) => r.enabled && !r.hidden),
    [],
  );

  return (
    <header className={styles.container}>
      <div className={styles.topbar}>
        <Topbar routes={enabledRoutes} />
      </div>
      <div className={styles.subContainer}>
        <div className={styles.themeToggle}>
          <ThemeToggle />
        </div>
        <div className={styles.companyInfo}>
          <CompanyInfo />
        </div>
      </div>
    </header>
  );
};

export default Header;
