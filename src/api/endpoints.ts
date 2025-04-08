export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  // Add other endpoint categories as needed
} as const;

// Type-safe endpoint getter
export const getEndpoint = <
  T extends keyof typeof API_ENDPOINTS,
  K extends keyof (typeof API_ENDPOINTS)[T],
>(
  category: T,
  endpoint: K,
): string => {
  if (!API_ENDPOINTS[category]) {
    throw new Error(`Invalid category: ${String(category)}`);
  }
  if (!API_ENDPOINTS[category][endpoint]) {
    throw new Error(
      `Invalid endpoint: ${String(endpoint)} for category: ${String(category)}`,
    );
  }
  return API_ENDPOINTS[category][endpoint] as string;
};
