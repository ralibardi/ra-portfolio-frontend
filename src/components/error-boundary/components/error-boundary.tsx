'use client';

import type { AppDictionary } from '@app/i18n/get-dictionary';
import { PAGES } from '@app/i18n/keys';
import { translate } from '@app/i18n/translate';
import ErrorPage from '@pages/error-page/components/error-page';
import type React from 'react';
import type { FunctionComponent } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import styles from '../assets/error-boundary.module.scss';

interface ErrorBoundaryProps {
  readonly children: React.ReactNode;
  readonly dictionary: AppDictionary;
}

const ErrorBoundary: FunctionComponent<ErrorBoundaryProps> = ({ children, dictionary }) => {
  return (
    <div className={styles.wrapper}>
      <ReactErrorBoundary
        FallbackComponent={({ error }) => (
          <ErrorPage
            error={error}
            title={translate(dictionary, PAGES.ERROR.TITLE)}
            message={translate(dictionary, PAGES.ERROR.MESSAGE)}
            actionLabel={translate(dictionary, PAGES.ERROR.GO_BACK)}
          />
        )}
      >
        {children}
      </ReactErrorBoundary>
    </div>
  );
};

export default ErrorBoundary;
