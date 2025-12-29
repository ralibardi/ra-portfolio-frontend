import Card from '@components/card';
import Container from '@components/container';
import Loading from '@components/loading';
import Section from '@components/section';
import type { FunctionComponent } from 'react';
import styles from '../assets/gaming-page.module.scss';

const GamingPage: FunctionComponent = () => (
  <div className={styles.container}>
    <Section title="Gaming" subtitle="My gaming projects and achievements" spacing="lg">
      <Container maxWidth="lg">
        <Card elevated className={styles.contentCard}>
          <Loading />
        </Card>
      </Container>
    </Section>
  </div>
);

export default GamingPage;
