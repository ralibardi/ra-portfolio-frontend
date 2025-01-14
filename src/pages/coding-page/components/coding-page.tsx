import React, { FunctionComponent, lazy, Suspense } from 'react';
import styles from '../assets/coding-page.module.scss';

const Loading = lazy(() => import('@components/loading'));

const CodingPage: FunctionComponent = () => (
  <div className={styles.container}>
    <Suspense fallback={<Loading />}>
      <Loading />
    </Suspense>
  </div>
);

export default CodingPage;
