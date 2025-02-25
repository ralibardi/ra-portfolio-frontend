import React, { FunctionComponent, lazy, Suspense } from 'react';

const Loading = lazy(() => import('@components/loading'));

import styles from '../assets/home-page.module.scss';

const HomePage: FunctionComponent = () => {
  return (
    <div className={styles.container} data-testid="container">
      <Suspense fallback={<Loading />}>
        <div className={styles.constructionMessage}>
          <h1>Under Construction</h1>
          <p>
            Thank you for your patience. The website is currently under
            development and will be available soon.
          </p>
        </div>
      </Suspense>
    </div>
  );
};

export default HomePage;
