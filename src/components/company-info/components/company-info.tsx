import { homePagePath } from '@utils/route-paths';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import styles from '../assets/company-info.module.scss';
import logo from '../assets/logo.jpg';

interface ICompanyInfoProps {
  label: string;
  isLabelHidden?: boolean;
}

const CompanyInfo = memo(function CompanyInfo({ isLabelHidden = false, label }: ICompanyInfoProps) {
  return (
    <div className={styles.container} data-testid="company-info">
      <Link href={homePagePath} className={styles.wrapper} data-testid="company-info-link">
        <Image
          src={logo}
          alt={`${label} logo`}
          className={styles.imageSmall}
          data-testid="company-info-logo"
        />
        {!isLabelHidden && (
          <span className={styles.label} data-testid="company-info-label">
            {label}
          </span>
        )}
      </Link>
    </div>
  );
});

export default CompanyInfo;
