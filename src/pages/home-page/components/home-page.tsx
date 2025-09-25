import React, { FunctionComponent, Suspense, useMemo } from 'react';
import Loading from '@components/loading';
import Grid from '@components/grid';
import Card from '@components/card';
import IconLink from '@components/icon-link';
import { PrimaryButton, SecondaryButton } from '@components/buttons';
import { GetSocialLinks } from '@components/footer/utils/getSocialLinks';

import styles from '../assets/home-page.module.scss';

const HomePage: FunctionComponent = () => {
  const socialLinks = useMemo(() => GetSocialLinks().slice(0, 3), []);

  const openLink = (url: string) => () =>
    window.open(url, '_blank', 'noopener');

  return (
    <div className={styles.container} data-testid="container">
      <div className={styles.bgDecor} aria-hidden="true" />
      <Suspense fallback={<Loading />}>
        <div className={styles.hero}>
          <div className={styles.constructionMessage}>
            <h1 className={styles.constructionMessageTitle}>
              Under Construction
            </h1>
            <p className={styles.constructionMessageText}>
              Thank you for your patience. The website is currently under
              development and will be available soon.
            </p>
            <div className={styles.actions}>
              <PrimaryButton
                label="View GitHub"
                onClick={openLink('https://github.com/ralibardi')}
                aria-label="View GitHub profile"
              />
              <SecondaryButton
                label="Connect on LinkedIn"
                onClick={openLink('https://www.linkedin.com/in/ronnyalibardi')}
                aria-label="Open LinkedIn profile"
              />
            </div>
          </div>
        </div>

        {socialLinks?.length > 0 && (
          <section className={styles.cards} aria-label="Quick links">
            <Grid columns={1} columnsMd={3} gap="lg">
              {socialLinks.map((link) => (
                <Card key={link.link} interactive elevated>
                  <IconLink icon={link.icon} linkUrl={link.link} />
                </Card>
              ))}
            </Grid>
          </section>
        )}
      </Suspense>
    </div>
  );
};

export default HomePage;
