import Card from '@components/card';
import Container from '@components/container';
import Section from '@components/section';
import { Button } from '@shared/components/ui/button';
import Link from 'next/link';
import { type FunctionComponent, memo } from 'react';
import styles from '../assets/error-page.module.scss';

interface ErrorPageProps {
  readonly error?: Error;
  readonly title: string;
  readonly message: string;
  readonly actionLabel: string;
  readonly actionHref?: string;
}

const ErrorPage: FunctionComponent<ErrorPageProps> = memo(
  ({ error, title, message, actionLabel, actionHref = '/' }) => {
    return (
      <div className={styles.container} data-testid="error-page-container">
        <Section spacing="lg">
          <Container maxWidth="md">
            <Card elevated className={styles.errorCard}>
              <div className={styles.header} data-testid="error-header-container">
                <Button variant="secondary" asChild>
                  <Link href={actionHref}>{actionLabel}</Link>
                </Button>
                <h1 className={styles.heading} data-testid="error-heading">
                  {title}
                </h1>
              </div>
              <p className={styles.message}>{message}</p>
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
            </Card>
          </Container>
        </Section>
      </div>
    );
  },
);

ErrorPage.displayName = 'ErrorPage';

export default ErrorPage;
