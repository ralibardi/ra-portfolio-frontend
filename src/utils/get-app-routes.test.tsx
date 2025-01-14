import React from 'react';
import { getAppRoutes } from './get-app-routes';

jest.mock('./route-paths', () => ({
  aboutPagePath: '/about',
  codingPagePath: '/coding',
  contactPagePath: '/contact',
  gamingPagePath: '/gaming',
  homePagePath: '/',
  photographyPagePath: '/photography',
}));

jest.mock('@pages/home-page', () => {
  const HomePageMock = () => <div data-testid="root-route">Mock BasePage</div>;
  return HomePageMock;
});

jest.mock('@pages/coding-page', () => {
  const CodingPageMock = () => (
    <div data-testid="root-route">Mock CodingPage</div>
  );
  return CodingPageMock;
});

jest.mock('@pages/photography-page', () => {
  const PhotographyPageMock = () => (
    <div data-testid="root-route">Mock PhotographyPage</div>
  );
  return PhotographyPageMock;
});

jest.mock('@pages/gaming-page', () => {
  const GamingPageMock = () => (
    <div data-testid="root-route">Mock GamingPage</div>
  );
  return GamingPageMock;
});

jest.mock('@pages/about-page', () => {
  const AboutPageMock = () => (
    <div data-testid="root-route">Mock AboutPage</div>
  );
  return AboutPageMock;
});

jest.mock('@pages/contact-page', () => {
  const ContactPageMock = () => (
    <div data-testid="root-route">Mock ContactPage</div>
  );
  return ContactPageMock;
});

describe('getAppRoutes', () => {
  it('should return an array of routes', () => {
    const routes = getAppRoutes;
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
  });

  it('should have the correct properties for each route', () => {
    const routes = getAppRoutes;
    routes.forEach((route) => {
      expect(route).toHaveProperty('path');
      expect(route).toHaveProperty('index');
      expect(route).toHaveProperty('component');
      expect(route).toHaveProperty('labelKey');
      expect(route).toHaveProperty('icon');

      if (route.enabled !== undefined) {
        expect(route).toHaveProperty('enabled');
      }
    });
  });

  it('should have unique paths for each route', () => {
    const routes = getAppRoutes;
    const paths = routes
      .filter((r) => r.enabled && !r.hidden)
      .map((route) => route.path);

    const uniquePaths = new Set(paths);
    expect(uniquePaths.size).toBe(paths.length);
  });

  it('should have unique labels for each route', () => {
    const routes = getAppRoutes;
    const labels = routes.map((route) => route.labelKey);
    const uniqueLabels = new Set(labels);
    expect(uniqueLabels.size).toBe(labels.length);
  });
});
