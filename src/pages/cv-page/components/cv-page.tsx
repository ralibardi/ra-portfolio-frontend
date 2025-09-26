import { type FunctionComponent, lazy, Suspense } from 'react';
import styles from '../assets/cv-page.module.scss';

const Loading = lazy(() => import('@components/loading'));

const CVPage: FunctionComponent = () => (
  <div className={styles.container}>
    <Suspense fallback={<Loading />}>
      <Loading />
    </Suspense>
  </div>
);

export default CVPage;
