import type { IApiError } from '@api/api-client';
import { renderHook } from '@testing-library/react';
import { useApiError } from './useApiError';

describe('useApiError', () => {
  beforeEach(() => {
    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console.error during tests
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return handleApiError function', () => {
    const { result } = renderHook(() => useApiError());

    expect(result.current.handleApiError).toBeDefined();
    expect(typeof result.current.handleApiError).toBe('function');
  });

  it('should attempt to redirect to login page when error code is 401', () => {
    // Note: JSDOM doesn't support navigation, so it logs an error when we try to navigate
    // We verify the navigation was attempted by checking for the JSDOM navigation error
    const { result } = renderHook(() => useApiError());
    const error: IApiError = { code: '401', message: 'Unauthorized' };

    // Should not throw
    expect(() => result.current.handleApiError(error)).not.toThrow();

    // JSDOM logs "Not implemented: navigation" when we try to set window.location.href
    // This confirms the hook attempted to navigate
    expect(console.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Not implemented: navigation'),
      }),
    );
  });

  it('should handle 403 forbidden errors without redirect', () => {
    const { result } = renderHook(() => useApiError());
    const error: IApiError = { code: '403', message: 'Forbidden' };

    expect(() => result.current.handleApiError(error)).not.toThrow();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should handle 404 not found errors without redirect', () => {
    const { result } = renderHook(() => useApiError());
    const error: IApiError = { code: '404', message: 'Not Found' };

    expect(() => result.current.handleApiError(error)).not.toThrow();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should handle 422 validation errors without redirect', () => {
    const { result } = renderHook(() => useApiError());
    const error: IApiError = { code: '422', message: 'Validation Error' };

    expect(() => result.current.handleApiError(error)).not.toThrow();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should handle network errors without redirect', () => {
    const { result } = renderHook(() => useApiError());
    const error: IApiError = {
      code: 'NETWORK_ERROR',
      message: 'Network Error',
    };

    expect(() => result.current.handleApiError(error)).not.toThrow();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should log to console for unhandled error codes', () => {
    const { result } = renderHook(() => useApiError());
    const error: IApiError = { code: '500', message: 'Server Error' };

    result.current.handleApiError(error);

    expect(console.error).toHaveBeenCalledWith('API Error:', error);
  });
});
