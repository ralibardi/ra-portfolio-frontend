import { PAGES } from '@app/i18n/keys';
import { ButtonWithIcon } from '@components/buttons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { type FunctionComponent, memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from '../assets/error-page.module.scss';

interface IErrorPage {
  error?: Error;
}

const ErrorPage: FunctionComponent<IErrorPage> = memo(({ error }) => {
  const { t } = useTranslation();

  const handleGoBack = () => window.history.back();

  return (
    <div className={styles.container} data-testid="error-page-container">
      <div className={styles.header} data-testid="error-header-container">
        <ButtonWithIcon icon={faArrowLeft} onClick={handleGoBack} />
        <h1 className={styles.heading} data-testid="error-heading">
          {t(PAGES.ERROR.TITLE)}
        </h1>
      </div>
      {error && (
        <details className={styles.description} data-testid="error-details">
          <summary className={styles.message} data-testid="error-details-message">
            {error.name} - {error.message}
          </summary>
          <pre className={styles.stack} data-testid="error-details-stack">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
});

ErrorPage.displayName = 'ErrorPage';

export default ErrorPage;
