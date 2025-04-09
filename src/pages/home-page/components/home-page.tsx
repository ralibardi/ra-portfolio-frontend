import React, { FunctionComponent, Suspense } from 'react';
import Loading from '@components/loading';

import styles from '../assets/home-page.module.scss';

const HomePage: FunctionComponent = () => {
  return (
    <div className={styles.container} data-testid="container">
      <Suspense fallback={<Loading />}>
        <div className={styles.constructionMessage}>
          <h1 className={styles.constructionMessageTitle}>
            Under Construction
          </h1>
          <p className={styles.constructionMessageText}>
            Thank you for your patience. The website is currently under
            development and will be available soon.
          </p>
        </div>
      </Suspense>
    </div>
  );
};

export default HomePage;
