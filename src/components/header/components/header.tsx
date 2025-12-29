import type { AppDictionary } from '@app/i18n/get-dictionary';
import { translate } from '@app/i18n/translate';
import CompanyInfo from '@components/company-info';
import ThemeToggle from '@components/theme-toggle';
import Topbar from '@components/topbar';
import type IRoute from '@type/route';
import { type FunctionComponent, useMemo } from 'react';
import styles from '../assets/header.module.scss';

interface HeaderProps {
  readonly routes: readonly IRoute[];
  readonly dictionary: AppDictionary;
}

const Header: FunctionComponent<HeaderProps> = ({ routes, dictionary }) => {
  const navigationRoutes = useMemo(
    () =>
      routes
        .filter((route) => !route.hidden)
        .map((route) => ({
          path: route.path,
          icon: route.icon,
          label: translate(dictionary, route.labelKey),
        })),
    [routes, dictionary],
  );

  return (
    <header className={styles.container}>
      <div className={styles.topbar}>
        <Topbar routes={navigationRoutes} />
      </div>
      <div className={styles.subContainer}>
        <div className={styles.themeToggle}>
          <ThemeToggle />
        </div>
        <div className={styles.companyInfo}>
          <CompanyInfo label={dictionary.company.name} />
        </div>
      </div>
    </header>
  );
};

export default Header;
