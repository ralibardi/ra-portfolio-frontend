import React, { FunctionComponent, lazy, Suspense } from 'react';
import styles from '../assets/gaming-page.module.scss';

const Loading = lazy(() => import('@components/loading'));

const GamingPage: FunctionComponent = () => (
  <div className={styles.container}>
    <Suspense fallback={<Loading />}>
      <Loading />
    </Suspense>
  </div>
);

export default GamingPage;
