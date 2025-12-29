import Card from '@components/card';
import Container from '@components/container';
import Loading from '@components/loading';
import Section from '@components/section';
import type { FunctionComponent } from 'react';
import styles from '../assets/coding-page.module.scss';

const CodingPage: FunctionComponent = () => (
  <div className={styles.container}>
    <Section title="Coding" subtitle="My coding projects and experience" spacing="lg">
      <Container maxWidth="lg">
        <Card elevated className={styles.contentCard}>
          <Loading />
        </Card>
      </Container>
    </Section>
  </div>
);

export default CodingPage;
