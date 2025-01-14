import React, { FunctionComponent } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import ErrorPage from '@pages/error-page/components/error-page';

interface IErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: FunctionComponent<IErrorBoundaryProps> = ({
  children,
}) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorPage}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
