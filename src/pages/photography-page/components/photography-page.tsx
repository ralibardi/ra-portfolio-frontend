import Card from '@components/card';
import Container from '@components/container';
import Loading from '@components/loading';
import Section from '@components/section';
import type { FunctionComponent } from 'react';
import styles from '../assets/photography-page.module.scss';

const PhotographyPage: FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <Section title="Photography" subtitle="My photography portfolio" spacing="lg">
        <Container maxWidth="lg">
          <Card elevated className={styles.contentCard}>
            <Loading />
          </Card>
        </Container>
      </Section>
    </div>
  );
};

export default PhotographyPage;
