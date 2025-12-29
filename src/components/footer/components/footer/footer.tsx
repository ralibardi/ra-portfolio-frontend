import type { AppDictionary } from '@app/i18n/get-dictionary';
import { type FunctionComponent, useMemo } from 'react';
import styles from '../../assets/footer.module.scss';
import { GetSocialLinks } from '../../utils/getSocialLinks';
import FooterSocials from '../footer-socials/footer-socials';

interface FooterProps {
  readonly dictionary: AppDictionary;
}

const Footer: FunctionComponent<FooterProps> = ({ dictionary }) => {
  const socialLinks = useMemo(() => GetSocialLinks(), []);

  return (
    <footer className={`${styles.container} site-footer`} data-testid="footer">
      <div className={styles.content}>
        <FooterSocials socialLinks={socialLinks} />
        <span className={styles.copyright} data-testid="footer-copyright">
          {dictionary.footer.copyright}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
