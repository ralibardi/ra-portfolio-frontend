import { getAppRoutes } from './get-app-routes';

describe('getAppRoutes', () => {
  const routes = getAppRoutes();

  it('returns an array of routes', () => {
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
  });

  it('provides routes with required properties', () => {
    routes.forEach((route) => {
      expect(route).toHaveProperty('path');
      expect(route).toHaveProperty('labelKey');
      expect(route).toHaveProperty('icon');
      expect(route).toHaveProperty('enabled');
    });
  });

  it('includes essential routes', () => {
    const required = ['/', '/contact', '/about', '/coding', '/photography', '/gaming', '/cv'];
    required.forEach((path) => {
      expect(routes.some((route) => route.path === path)).toBe(true);
    });
  });

  it('marks hidden routes correctly', () => {
    const hiddenRoutes = routes.filter((route) => route.hidden);
    hiddenRoutes.forEach((route) => {
      expect(typeof route.hidden).toBe('boolean');
    });
  });
});
