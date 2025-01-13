import React, { FunctionComponent, lazy, Suspense } from 'react';
import styles from '../assets/contact-page.module.scss';

const Loading = lazy(() => import('@components/loading'));

const ContactPage: FunctionComponent = () => (
  <div className={styles.container}>
    <Suspense fallback={<Loading />}>
      <Loading />
    </Suspense>
  </div>
);

export default ContactPage;
