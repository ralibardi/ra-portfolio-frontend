import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';
import styles from '../assets/icon-link.module.scss';
import type { IIconLinkProps } from '../types/icon-link-props';

const IconLink = memo(({ icon, linkUrl, title }: IIconLinkProps) => {
  const ariaLabel = title ?? icon?.iconName ?? 'Link';

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={styles.container}
      data-testid="icon-link"
    >
      <FontAwesomeIcon icon={icon} className={styles.icon} data-testid="icon-link-icon" />
      {title && (
        <span className={styles.label} data-testid="icon-link-label">
          {title}
        </span>
      )}
    </a>
  );
});

IconLink.displayName = 'IconLink';

export default IconLink;
