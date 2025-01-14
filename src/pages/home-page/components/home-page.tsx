import React, { FunctionComponent, lazy, Suspense } from 'react';

const Loading = lazy(() => import('@components/loading'));

import styles from '../assets/home-page.module.scss';

const HomePage: FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <Suspense fallback={<Loading />}>
        <Loading />
      </Suspense>
    </div>
  );
};

export default HomePage;
