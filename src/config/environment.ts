/**
 * Environment Configuration
 *
 * Simple environment variable configuration for different backends.
 */

export interface IEnvironmentConfig {
  apiBaseUrl: string;
  environment: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

/**
 * Get the current environment configuration
 */
export const getEnvironmentConfig = (): IEnvironmentConfig => {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api';
  const environment =
    ((import.meta.env.VITE_APP_ENV || import.meta.env.MODE) as string) || 'development';

  return {
    apiBaseUrl,
    environment: environment as IEnvironmentConfig['environment'],
    isDevelopment: environment === 'development',
    isProduction: environment === 'production',
    isTest: environment === 'test',
  };
};

/**
 * Environment configuration instance
 */
export const env = getEnvironmentConfig();

/**
 * Validate required environment variables
 */
export const validateEnvironment = (): void => {
  const requiredVars = ['VITE_API_BASE_URL'];
  const missing = requiredVars.filter((varName) => !import.meta.env[varName]);

  if (missing.length > 0) {
    // In development, warn about missing environment variables
    if (process.env.NODE_ENV === 'development') {
      // Development configuration monitoring
      // biome-ignore lint/suspicious/noConsole: Development logging
      console.warn('Missing environment variables:', missing);
    }
  }
};

// Validate on module load
if (typeof window !== 'undefined') {
  validateEnvironment();
}
