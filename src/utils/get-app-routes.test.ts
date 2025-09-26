import { getAppRoutes } from './get-app-routes';

describe('getAppRoutes', () => {
  it('should return an array of routes', () => {
    expect(Array.isArray(getAppRoutes)).toBe(true);
    expect(getAppRoutes.length).toBeGreaterThan(0);
  });

  it('should return routes with required properties', () => {
    getAppRoutes.forEach((route) => {
      expect(route).toHaveProperty('path');
      expect(route).toHaveProperty('component');
      expect(route).toHaveProperty('labelKey');
      expect(route).toHaveProperty('icon');
      expect(route).toHaveProperty('enabled');
      expect(route).toHaveProperty('hidden');
      expect(typeof route.path).toBe('string');
    });
  });

  it('should include home route', () => {
    const homeRoute = getAppRoutes.find((route) => route.path === '/');
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.enabled).toBe(true);
    expect(homeRoute?.hidden).toBe(false);
  });

  it('should include contact route', () => {
    const contactRoute = getAppRoutes.find((route) => route.path === '/contact');
    expect(contactRoute).toBeDefined();
  });

  it('should include about route', () => {
    const aboutRoute = getAppRoutes.find((route) => route.path === '/about');
    expect(aboutRoute).toBeDefined();
  });

  it('should include coding route', () => {
    const codingRoute = getAppRoutes.find((route) => route.path === '/coding');
    expect(codingRoute).toBeDefined();
  });

  it('should include photography route', () => {
    const photographyRoute = getAppRoutes.find((route) => route.path === '/photography');
    expect(photographyRoute).toBeDefined();
  });

  it('should include gaming route', () => {
    const gamingRoute = getAppRoutes.find((route) => route.path === '/gaming');
    expect(gamingRoute).toBeDefined();
  });

  it('should include cv route', () => {
    const cvRoute = getAppRoutes.find((route) => route.path === '/cv');
    expect(cvRoute).toBeDefined();
  });

  it('should include health route', () => {
    const healthRoute = getAppRoutes.find((route) => route.path === '/health');
    expect(healthRoute).toBeDefined();
    expect(healthRoute?.enabled).toBe(true);
    expect(healthRoute?.hidden).toBe(true);
  });

  it('should include error route', () => {
    const errorRoute = getAppRoutes.find((route) => route.path === '/error');
    expect(errorRoute).toBeDefined();
    expect(errorRoute?.enabled).toBe(true);
    expect(errorRoute?.hidden).toBe(true);
  });

  it('should have correct route structure', () => {
    getAppRoutes.forEach((route) => {
      expect(route.index).toBe(true);
      expect(typeof route.labelKey).toBe('string');
      expect(typeof route.enabled).toBe('boolean');
      expect(typeof route.hidden).toBe('boolean');
    });
  });

  it('should have enabled routes', () => {
    const enabledRoutes = getAppRoutes.filter((route) => route.enabled);
    expect(enabledRoutes.length).toBeGreaterThan(0);
  });

  it('should have visible routes', () => {
    const visibleRoutes = getAppRoutes.filter((route) => !route.hidden);
    expect(visibleRoutes.length).toBeGreaterThan(0);
  });

  it('should have unique paths', () => {
    const paths = getAppRoutes.map((route) => route.path);
    const uniquePaths = [...new Set(paths)];
    expect(paths.length).toBe(uniquePaths.length);
  });
});
