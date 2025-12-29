/**
 * Environment Configuration
 */

export interface IEnvironmentConfig {
  apiBaseUrl: string;
  environment: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

const getEnv = (key: string): string | undefined => {
  return process.env[key];
};

/**
 * Get the current environment configuration
 */
export const getEnvironmentConfig = (): IEnvironmentConfig => {
  const apiBaseUrl =
    getEnv('NEXT_PUBLIC_API_BASE_URL') ?? getEnv('API_BASE_URL') ?? 'http://localhost:5000/api';

  const environment = (getEnv('NEXT_PUBLIC_APP_ENV') ??
    process.env.NODE_ENV ??
    'development') as IEnvironmentConfig['environment'];

  return {
    apiBaseUrl,
    environment,
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
  const requiredVars = ['NEXT_PUBLIC_API_BASE_URL'];
  const missing = requiredVars.filter((varName) => !getEnv(varName));

  if (missing.length > 0 && process.env.NODE_ENV === 'development') {
    // biome-ignore lint/suspicious/noConsole: development diagnostics
    console.warn('Missing environment variables:', missing);
  }
};

if (typeof window !== 'undefined') {
  validateEnvironment();
}
