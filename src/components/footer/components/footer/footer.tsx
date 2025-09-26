import { FOOTER } from '@app/i18n/keys';
import { type FunctionComponent, lazy, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../assets/footer.module.scss';
import { GetSocialLinks } from '../../utils/getSocialLinks';

const FooterSocials = lazy(() => import('../footer-socials/footer-socials'));

const Footer: FunctionComponent = () => {
  const { t } = useTranslation();
  const socialLinks = useMemo(() => GetSocialLinks(), []);

  return (
    <footer className={styles.container} data-testid="footer">
      <FooterSocials socialLinks={socialLinks} />
      <span className={styles.copyright} data-testid="footer-copyright">
        {t(FOOTER.COPYRIGHT)}
      </span>
    </footer>
  );
};

export default Footer;
