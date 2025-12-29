import Card from '@components/card';
import Container from '@components/container';
import { GetSocialLinks } from '@components/footer/utils/getSocialLinks';
import Grid from '@components/grid';
import IconLink from '@components/icon-link';
import Section from '@components/section';
import { Button } from '@shared/components/ui/button';
import type { FunctionComponent } from 'react';
import styles from '../assets/home-page.module.scss';

const HomePage: FunctionComponent = () => {
  const socialLinks = GetSocialLinks().slice(0, 3);

  return (
    <div className={styles.container} data-testid="container">
      <div className={styles.bgDecor} aria-hidden="true" />
      <Container maxWidth="xl" className={styles.hero}>
        <Card elevated className={styles.constructionMessage}>
          <h1 className={styles.constructionMessageTitle}>Under Construction</h1>
          <p className={styles.constructionMessageText}>
            Thank you for your patience. The website is currently under development and will be
            available soon.
          </p>
          <div className={styles.actions}>
            <Button asChild aria-label="View GitHub profile">
              <a href="https://github.com/ralibardi" target="_blank" rel="noopener noreferrer">
                View GitHub
              </a>
            </Button>
            <Button variant="secondary" asChild aria-label="Open LinkedIn profile">
              <a
                href="https://www.linkedin.com/in/ronnyalibardi"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
            </Button>
          </div>
        </Card>
      </Container>

      {socialLinks?.length > 0 && (
        <Section
          title="Quick Links"
          subtitle="Connect with me on social media"
          spacing="lg"
          className={styles.socialSection}
        >
          <Container maxWidth="xl">
            <Grid columns={1} columnsMd={3} gap="lg">
              {socialLinks.map((link) => (
                <Card key={link.link} interactive elevated>
                  <IconLink icon={link.icon} linkUrl={link.link} />
                </Card>
              ))}
            </Grid>
          </Container>
        </Section>
      )}
    </div>
  );
};

export default HomePage;
