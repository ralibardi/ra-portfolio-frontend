import Card from '@components/card';
import Container from '@components/container';
import Loading from '@components/loading';
import Section from '@components/section';
import type { FunctionComponent } from 'react';
import styles from '../assets/health-page.module.scss';

const HealthPage: FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <Section title="Health" subtitle="Health and wellness information" spacing="lg">
        <Container maxWidth="lg">
          <Card elevated className={styles.contentCard}>
            <Loading />
          </Card>
        </Container>
      </Section>
    </div>
  );
};

export default HealthPage;
