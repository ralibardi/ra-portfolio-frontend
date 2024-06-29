import React, { lazy } from 'react';

const Loading = lazy(() => import('@components/loading'));

import styles from './assets/gamingPage.module.scss';

const GamingPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Loading />
    </div>
  );
};

export default GamingPage;
