import ErrorPage from '@pages/error-page/components/error-page';
import type React from 'react';
import type { FunctionComponent } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface IErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: FunctionComponent<IErrorBoundaryProps> = ({ children }) => {
  return <ReactErrorBoundary FallbackComponent={ErrorPage}>{children}</ReactErrorBoundary>;
};

export default ErrorBoundary;
