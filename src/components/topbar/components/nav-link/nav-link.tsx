'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import Link from 'next/link';
import { memo } from 'react';
import styles from '../../assets/nav-link.module.scss';
import type { NavigationLink } from '../../types/topbar-props';

interface NavLinkProps {
  readonly route: NavigationLink;
  readonly isActive: boolean;
}

const NavLink = memo(function NavLink({ route, isActive }: NavLinkProps) {
  return (
    <Link href={route.path} className={cn(styles.link, { [styles.active]: isActive })}>
      <FontAwesomeIcon icon={route.icon} className={styles.icon} data-testid="nav-link-icon" />
      <span className={styles.label} data-testid="nav-link-label">
        {route.label}
      </span>
    </Link>
  );
});

export default NavLink;
