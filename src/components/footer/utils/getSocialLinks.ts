import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faAndroid,
  faAppStore,
  faGithub,
  faInstagram,
  faLinkedinIn,
  faSpotify,
  faStackOverflow,
  faXbox,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';

import socialLinks from './socialLinks.json';

export interface ISocialLink {
  icon: IconDefinition;
  link: string;
  order: number;
  isHidden: boolean;
}

const iconMap: Record<string, IconDefinition> = {
  faGithub,
  faStackOverflow,
  faAndroid,
  faAppStore,
  faLinkedinIn,
  faInstagram,
  faXbox,
  faXTwitter,
  faSpotify,
};

export function GetSocialLinks(): ISocialLink[] {
  return socialLinks
    .filter((link) => !link.isHidden)
    .map((link) => ({
      ...link,
      icon: iconMap[link.icon],
    }))
    .sort((a, b) => a.order - b.order);
}
