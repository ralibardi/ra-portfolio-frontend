import Card from '@components/card';
import Container from '@components/container';
import Loading from '@components/loading';
import Section from '@components/section';
import type { FunctionComponent } from 'react';
import styles from '../assets/about-page.module.scss';

const AboutPage: FunctionComponent = () => {
  return (
    <div className={styles.container} data-testid="about-page">
      <Section title="About" subtitle="Learn more about me" spacing="lg">
        <Container maxWidth="lg">
          <Card elevated className={styles.contentCard}>
            <Loading />
          </Card>
        </Container>
      </Section>
    </div>
  );
};

export default AboutPage;
