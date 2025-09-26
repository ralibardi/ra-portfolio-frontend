import { type FunctionComponent, lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const Loading = lazy(() => import('@components/loading'));
const Header = lazy(() => import('@components/header'));
const Footer = lazy(() => import('@components/footer'));

import styles from '../assets/base-page.module.scss';

const BasePage: FunctionComponent = () => {
  return (
    <main className={styles.container}>
      <Suspense fallback={<Loading />}>
        <Header />
      </Suspense>
      <div className={styles.content}>
        <Outlet />
      </div>
      <Suspense fallback={<Loading />}>
        <Footer />
      </Suspense>
    </main>
  );
};

export default BasePage;
