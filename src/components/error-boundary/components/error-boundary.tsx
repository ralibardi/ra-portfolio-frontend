import ErrorPage from '@pages/error-page/components/error-page';
import type React from 'react';
import type { FunctionComponent } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import styles from '../assets/error-boundary.module.scss';

interface IErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: FunctionComponent<IErrorBoundaryProps> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <ReactErrorBoundary FallbackComponent={ErrorPage}>{children}</ReactErrorBoundary>
    </div>
  );
};

export default ErrorBoundary;
