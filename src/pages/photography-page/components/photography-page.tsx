import { type FunctionComponent, lazy, Suspense } from 'react';

const Loading = lazy(() => import('@components/loading'));

import styles from '../assets/photography-page.module.scss';

const PhotographyPage: FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <Suspense fallback={<Loading />}>
        <Loading />
      </Suspense>
    </div>
  );
};

export default PhotographyPage;
