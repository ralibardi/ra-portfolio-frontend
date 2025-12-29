import type { ISocialLink } from '@components/footer/utils/getSocialLinks';
import IconLink from '@components/icon-link';
import { ComponentArray } from '@utils/component-array';
import { type FunctionComponent, useMemo } from 'react';

import styles from '../../assets/footer-socials.module.scss';

interface IFooterSocials {
  socialLinks: ISocialLink[];
}

const FooterSocials: FunctionComponent<IFooterSocials> = ({ socialLinks }) => {
  const socialLinksSorted = useMemo(
    () => socialLinks.filter((link) => !link.isHidden).sort((a, b) => a.order - b.order),
    [socialLinks],
  );

  return (
    <nav
      className={`${styles.container} footer-social`}
      data-testid="test"
      aria-label="Social links"
    >
      <ComponentArray
        render={({ icon, link }) => <IconLink icon={icon} linkUrl={link} />}
        of={socialLinksSorted}
        keyExtractor={(item) => item.link}
      />
    </nav>
  );
};

export default FooterSocials;
