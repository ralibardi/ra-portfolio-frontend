import { PAGES } from '@app/i18n/keys';
import {
  faAddressCard,
  faCamera,
  faFile,
  faGamepad,
  faHome,
  faStethoscope,
  faTerminal,
  faUser,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import type IRoute from '@type/route';
import {
  aboutPagePath,
  codingPagePath,
  contactPagePath,
  cvPagePath,
  errorPagePath,
  gamingPagePath,
  healthPagePath,
  homePagePath,
  photographyPagePath,
} from './route-paths';

const routes: IRoute[] = [
  {
    path: homePagePath,
    labelKey: PAGES.HOME.NAME,
    icon: faHome,
    enabled: true,
    hidden: false,
  },
  {
    path: codingPagePath,
    labelKey: PAGES.CODING.NAME,
    icon: faTerminal,
    enabled: false,
    hidden: false,
  },
  {
    path: photographyPagePath,
    labelKey: PAGES.PHOTOGRAPHY.NAME,
    icon: faCamera,
    enabled: false,
    hidden: false,
  },
  {
    path: gamingPagePath,
    labelKey: PAGES.GAMING.NAME,
    icon: faGamepad,
    enabled: false,
    hidden: false,
  },
  {
    path: aboutPagePath,
    labelKey: PAGES.ABOUT.NAME,
    icon: faUser,
    enabled: false,
    hidden: false,
  },
  {
    path: contactPagePath,
    labelKey: PAGES.CONTACT.NAME,
    icon: faAddressCard,
    enabled: false,
    hidden: false,
  },
  {
    path: cvPagePath,
    labelKey: PAGES.CV.NAME,
    icon: faFile,
    enabled: false,
    hidden: false,
  },
  {
    path: healthPagePath,
    labelKey: PAGES.HEALTH.NAME,
    icon: faStethoscope,
    enabled: true,
    hidden: true,
  },
  {
    path: errorPagePath,
    labelKey: PAGES.ERROR.NAME,
    icon: faX,
    enabled: true,
    hidden: true,
  },
];

export const getAppRoutes = (): readonly IRoute[] => routes;
