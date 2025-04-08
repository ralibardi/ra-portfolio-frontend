import { API_ENDPOINTS, getEndpoint } from './endpoints';

describe('API_ENDPOINTS', () => {
  it('should contain AUTH category with expected endpoints', () => {
    expect(API_ENDPOINTS.AUTH).toBeDefined();
    expect(API_ENDPOINTS.AUTH.LOGIN).toBe('/auth/login');
    expect(API_ENDPOINTS.AUTH.REGISTER).toBe('/auth/register');
    expect(API_ENDPOINTS.AUTH.REFRESH_TOKEN).toBe('/auth/refresh-token');
    expect(API_ENDPOINTS.AUTH.LOGOUT).toBe('/auth/logout');
  });
});

describe('getEndpoint', () => {
  it('should return the correct endpoint string for a given category and endpoint', () => {
    expect(getEndpoint('AUTH', 'LOGIN')).toBe('/auth/login');
    expect(getEndpoint('AUTH', 'REGISTER')).toBe('/auth/register');
    expect(getEndpoint('AUTH', 'REFRESH_TOKEN')).toBe('/auth/refresh-token');
    expect(getEndpoint('AUTH', 'LOGOUT')).toBe('/auth/logout');
  });

  it('should be type-safe and only accept valid categories and endpoints', () => {
    // Test valid usage
    const loginEndpoint = getEndpoint('AUTH', 'LOGIN');
    expect(typeof loginEndpoint).toBe('string');
    expect(loginEndpoint).toBe('/auth/login');

    // Test invalid category
    expect(() => {
      // @ts-expect-error - Testing invalid category
      getEndpoint('INVALID_CATEGORY', 'LOGIN');
    }).toThrow();

    // Test invalid endpoint
    expect(() => {
      // @ts-expect-error - Testing invalid endpoint
      getEndpoint('AUTH', 'INVALID_ENDPOINT');
    }).toThrow();
  });
});
