import React, { FunctionComponent, lazy, useMemo } from 'react';
import { ComponentArray } from '@utils/component-array';
import { ISocialLink } from '@components/footer/utils/getSocialLinks';

const IconLink = lazy(() => import('@components/icon-link'));

import styles from '../../assets/footer-socials.module.scss';

interface IFooterSocials {
  socialLinks: ISocialLink[];
}

const FooterSocials: FunctionComponent<IFooterSocials> = ({ socialLinks }) => {
  const socialLinksSorted = useMemo(
    () =>
      socialLinks
        .filter((link) => !link.isHidden)
        .sort((a, b) => a.order - b.order),
    [socialLinks],
  );

  return (
    <div className={styles.container} data-testid="test">
      <ComponentArray
        render={({ icon, link }) => <IconLink icon={icon} linkUrl={link} />}
        of={socialLinksSorted}
      />
    </div>
  );
};

export default FooterSocials;
