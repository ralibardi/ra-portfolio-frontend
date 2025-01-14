import React, { FunctionComponent, Suspense } from 'react';

const Loading = React.lazy(() => import('@components/loading'));

import styles from '../assets/health-page.module.scss';

const HealthPage: FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <Suspense fallback={<Loading />}>
        <Loading />
      </Suspense>
    </div>
  );
};

export default HealthPage;
