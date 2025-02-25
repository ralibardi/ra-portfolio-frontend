import React, { FunctionComponent, lazy, Suspense } from 'react';

const Loading = lazy(() => import('@components/loading'));

import styles from '../assets/about-page.module.scss';

const AboutPage: FunctionComponent = () => {
  return (
    <div className={styles.container} data-testid="about-page">
      <Suspense fallback={<Loading />}>
        <Loading />
      </Suspense>
    </div>
  );
};

export default AboutPage;
