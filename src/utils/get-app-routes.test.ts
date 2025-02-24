import { getAppRoutes } from './get-app-routes';
import {
  homePagePath,
  codingPagePath,
  photographyPagePath,
  gamingPagePath,
  aboutPagePath,
  contactPagePath,
  cvPagePath,
  healthPagePath,
  errorPagePath,
} from './route-paths';
import { PAGES } from '@app/i18n/keys';
import {
  faHome,
  faTerminal,
  faCamera,
  faGamepad,
  faUser,
  faAddressCard,
  faFile,
  faStethoscope,
  faX,
} from '@fortawesome/free-solid-svg-icons';

describe('getAppRoutes', () => {
  it('should export an array with 9 routes', () => {
    expect(Array.isArray(getAppRoutes)).toBe(true);
    expect(getAppRoutes).toHaveLength(9);
  });

  it('should have correct properties for the home route', () => {
    const homeRoute = getAppRoutes.find((route) => route.path === homePagePath);
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.index).toBe(true);
    expect(homeRoute?.labelKey).toBe(PAGES.HOME.NAME);
    expect(homeRoute?.icon).toEqual(faHome);
    expect(homeRoute?.enabled).toBe(true);
    expect(homeRoute?.hidden).toBe(false);
    expect(homeRoute?.component).toBeDefined();
  });

  it('should have correct properties for the coding route', () => {
    const codingRoute = getAppRoutes.find(
      (route) => route.path === codingPagePath,
    );
    expect(codingRoute).toBeDefined();
    expect(codingRoute?.index).toBe(true);
    expect(codingRoute?.labelKey).toBe(PAGES.CODING.NAME);
    expect(codingRoute?.icon).toEqual(faTerminal);
    expect(codingRoute?.enabled).toBe(false);
    expect(codingRoute?.hidden).toBe(false);
  });

  it('should have correct properties for the photography route', () => {
    const photographyRoute = getAppRoutes.find(
      (route) => route.path === photographyPagePath,
    );
    expect(photographyRoute).toBeDefined();
    expect(photographyRoute?.index).toBe(true);
    expect(photographyRoute?.labelKey).toBe(PAGES.PHOTOGRAPHY.NAME);
    expect(photographyRoute?.icon).toEqual(faCamera);
    expect(photographyRoute?.enabled).toBe(false);
    expect(photographyRoute?.hidden).toBe(false);
  });

  it('should have correct properties for the gaming route', () => {
    const gamingRoute = getAppRoutes.find(
      (route) => route.path === gamingPagePath,
    );
    expect(gamingRoute).toBeDefined();
    expect(gamingRoute?.index).toBe(true);
    expect(gamingRoute?.labelKey).toBe(PAGES.GAMING.NAME);
    expect(gamingRoute?.icon).toEqual(faGamepad);
    expect(gamingRoute?.enabled).toBe(false);
    expect(gamingRoute?.hidden).toBe(false);
  });

  it('should have correct properties for the about route', () => {
    const aboutRoute = getAppRoutes.find(
      (route) => route.path === aboutPagePath,
    );
    expect(aboutRoute).toBeDefined();
    expect(aboutRoute?.index).toBe(true);
    expect(aboutRoute?.labelKey).toBe(PAGES.ABOUT.NAME);
    expect(aboutRoute?.icon).toEqual(faUser);
    expect(aboutRoute?.enabled).toBe(false);
    expect(aboutRoute?.hidden).toBe(false);
  });

  it('should have correct properties for the contact route', () => {
    const contactRoute = getAppRoutes.find(
      (route) => route.path === contactPagePath,
    );
    expect(contactRoute).toBeDefined();
    expect(contactRoute?.index).toBe(true);
    expect(contactRoute?.labelKey).toBe(PAGES.CONTACT.NAME);
    expect(contactRoute?.icon).toEqual(faAddressCard);
    expect(contactRoute?.enabled).toBe(false);
    expect(contactRoute?.hidden).toBe(false);
  });

  it('should have correct properties for the cv route', () => {
    const cvRoute = getAppRoutes.find((route) => route.path === cvPagePath);
    expect(cvRoute).toBeDefined();
    expect(cvRoute?.index).toBe(true);
    expect(cvRoute?.labelKey).toBe(PAGES.CV.NAME);
    expect(cvRoute?.icon).toEqual(faFile);
    expect(cvRoute?.enabled).toBe(false);
    expect(cvRoute?.hidden).toBe(false);
  });

  it('should have correct properties for the health route', () => {
    const healthRoute = getAppRoutes.find(
      (route) => route.path === healthPagePath,
    );
    expect(healthRoute).toBeDefined();
    expect(healthRoute?.index).toBe(true);
    expect(healthRoute?.labelKey).toBe(PAGES.HEALTH.NAME);
    expect(healthRoute?.icon).toEqual(faStethoscope);
    expect(healthRoute?.enabled).toBe(true);
    expect(healthRoute?.hidden).toBe(true);
  });

  it('should have correct properties for the error route', () => {
    const errorRoute = getAppRoutes.find(
      (route) => route.path === errorPagePath,
    );
    expect(errorRoute).toBeDefined();
    expect(errorRoute?.index).toBe(true);
    expect(errorRoute?.labelKey).toBe(PAGES.ERROR.NAME);
    expect(errorRoute?.icon).toEqual(faX);
    expect(errorRoute?.enabled).toBe(true);
    expect(errorRoute?.hidden).toBe(true);
  });

  it('should match the snapshot', () => {
    expect(getAppRoutes).toMatchSnapshot();
  });
});
