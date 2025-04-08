import { useCallback } from 'react';
import { IApiError } from '@api/api-client';

export const useApiError = () => {
  const handleApiError = useCallback((error: IApiError) => {
    // Handle different error codes
    switch (error.code) {
      case '401':
        // Handle unauthorized
        window.location.href = '/login';
        break;
      case '403':
        // Handle forbidden
        break;
      case '404':
        // Handle not found
        break;
      case '422':
        // Handle validation errors
        break;
      case 'NETWORK_ERROR':
        // Handle network errors
        break;
      default:
        // Handle other errors
        console.error('API Error:', error);
    }

    // You can integrate with your notification system here
    // showNotification({ type: 'error', message: error.message });
  }, []);

  return { handleApiError };
};
