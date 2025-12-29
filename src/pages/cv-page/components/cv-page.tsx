import Card from '@components/card';
import Container from '@components/container';
import Loading from '@components/loading';
import Section from '@components/section';
import type { FunctionComponent } from 'react';
import styles from '../assets/cv-page.module.scss';

const CVPage: FunctionComponent = () => (
  <div className={styles.container}>
    <Section
      title="Curriculum Vitae"
      subtitle="My professional experience and qualifications"
      spacing="lg"
    >
      <Container maxWidth="lg">
        <Card elevated className={styles.contentCard}>
          <Loading />
        </Card>
      </Container>
    </Section>
  </div>
);

export default CVPage;
