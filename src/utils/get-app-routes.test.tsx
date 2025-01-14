import { getAppRoutes } from './get-app-routes';
import {
  aboutPagePath,
  codingPagePath,
  contactPagePath,
  gamingPagePath,
  homePagePath,
  photographyPagePath,
  cvPagePath,
  healthPagePath,
  errorPagePath,
} from './route-paths';
import { PAGES } from '@app/i18n/keys';

describe('getAppRoutes', () => {
  it('should contain the correct number of routes', () => {
    expect(getAppRoutes).toHaveLength(9);
  });

  it('should have home page as the first route', () => {
    const homeRoute = getAppRoutes[0];
    expect(homeRoute.path).toBe(homePagePath);
    expect(homeRoute.labelKey).toBe(PAGES.HOME.NAME);
    expect(homeRoute.enabled).toBe(true);
    expect(homeRoute.hidden).toBe(false);
    expect(homeRoute.index).toBe(true);
  });

  it('should have all routes with required properties', () => {
    getAppRoutes.forEach(route => {
      expect(route).toHaveProperty('path');
      expect(route).toHaveProperty('index');
      expect(route).toHaveProperty('component');
      expect(route).toHaveProperty('labelKey');
      expect(route).toHaveProperty('icon');
      expect(route).toHaveProperty('enabled');
      expect(route).toHaveProperty('hidden');
    });
  });

  it('should have health and error pages hidden', () => {
    const healthRoute = getAppRoutes.find(route => route.path === healthPagePath);
    const errorRoute = getAppRoutes.find(route => route.path === errorPagePath);

    expect(healthRoute?.hidden).toBe(true);
    expect(errorRoute?.hidden).toBe(true);
  });

  it('should have only home, health and error pages enabled', () => {
    const enabledRoutes = getAppRoutes.filter(route => route.enabled);
    expect(enabledRoutes).toHaveLength(3);

    const enabledPaths = enabledRoutes.map(route => route.path);
    expect(enabledPaths).toContain(homePagePath);
    expect(enabledPaths).toContain(healthPagePath);
    expect(enabledPaths).toContain(errorPagePath);
  });

  it('should have all routes with valid components', () => {
    getAppRoutes.forEach((route, index) => {
      expect(route.component).toBeDefined();
      expect(route.component).toBe(getAppRoutes[index].component);
    });
  });
});