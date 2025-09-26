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
import { lazy } from 'react';
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

const HomePage = lazy(() => import('@pages/home-page'));
const CodingPage = lazy(() => import('@pages/coding-page'));
const PhotographyPage = lazy(() => import('@pages/photography-page'));
const GamingPage = lazy(() => import('@pages/gaming-page'));
const AboutPage = lazy(() => import('@pages/about-page'));
const ContactPage = lazy(() => import('@pages/contact-page'));
const CVPage = lazy(() => import('@pages/cv-page'));
const HealthPage = lazy(() => import('@pages/health-page'));
const ErrorPage = lazy(() => import('@pages/error-page'));

export const getAppRoutes: IRoute[] = [
  {
    path: homePagePath,
    index: true,
    component: HomePage,
    labelKey: PAGES.HOME.NAME,
    icon: faHome,
    enabled: true,
    hidden: false,
  },
  {
    path: codingPagePath,
    index: true,
    component: CodingPage,
    labelKey: PAGES.CODING.NAME,
    icon: faTerminal,
    enabled: false,
    hidden: false,
  },
  {
    path: photographyPagePath,
    index: true,
    component: PhotographyPage,
    labelKey: PAGES.PHOTOGRAPHY.NAME,
    icon: faCamera,
    enabled: false,
    hidden: false,
  },
  {
    path: gamingPagePath,
    index: true,
    component: GamingPage,
    labelKey: PAGES.GAMING.NAME,
    icon: faGamepad,
    enabled: false,
    hidden: false,
  },
  {
    path: aboutPagePath,
    index: true,
    component: AboutPage,
    labelKey: PAGES.ABOUT.NAME,
    icon: faUser,
    enabled: false,
    hidden: false,
  },
  {
    path: contactPagePath,
    index: true,
    component: ContactPage,
    labelKey: PAGES.CONTACT.NAME,
    icon: faAddressCard,
    enabled: false,
    hidden: false,
  },
  {
    path: cvPagePath,
    index: true,
    component: CVPage,
    labelKey: PAGES.CV.NAME,
    icon: faFile,
    enabled: false,
    hidden: false,
  },
  {
    path: healthPagePath,
    index: true,
    component: HealthPage,
    labelKey: PAGES.HEALTH.NAME,
    icon: faStethoscope,
    enabled: true,
    hidden: true,
  },
  {
    path: errorPagePath,
    index: true,
    component: ErrorPage,
    labelKey: PAGES.ERROR.NAME,
    icon: faX,
    enabled: true,
    hidden: true,
  },
];
