import { renderHook } from '@testing-library/react';
import { useApiError } from './useApiError';
import { IApiError } from '@api/api-client';

describe('useApiError', () => {
  // Save original window.location
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock window.location
    delete (window as Partial<Window>).location;
    window.location = { ...originalLocation, href: '' };
  });

  afterEach(() => {
    // Restore mocks
    jest.restoreAllMocks();

    // Restore window.location
    window.location = originalLocation;
  });

  it('should return handleApiError function', () => {
    // Arrange & Act
    const { result } = renderHook(() => useApiError());

    // Assert
    expect(result.current.handleApiError).toBeDefined();
    expect(typeof result.current.handleApiError).toBe('function');
  });

  it('should redirect to login page when error code is 401', () => {
    // Arrange
    const { result } = renderHook(() => useApiError());
    const error: IApiError = { code: '401', message: 'Unauthorized' };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(window.location.href).toBe('/login');
  });

  it('should handle 403 forbidden errors', () => {
    // Arrange
    const { result } = renderHook(() => useApiError());
    const error: IApiError = { code: '403', message: 'Forbidden' };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(window.location.href).not.toBe('/login');
    // No specific assertion since the implementation is empty
  });

  it('should handle 404 not found errors', () => {
    // Arrange
    const { result } = renderHook(() => useApiError());
    const error: IApiError = { code: '404', message: 'Not Found' };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(window.location.href).not.toBe('/login');
    // No specific assertion since the implementation is empty
  });

  it('should handle 422 validation errors', () => {
    // Arrange
    const { result } = renderHook(() => useApiError());
    const error: IApiError = { code: '422', message: 'Validation Error' };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(window.location.href).not.toBe('/login');
    // No specific assertion since the implementation is empty
  });

  it('should handle network errors', () => {
    // Arrange
    const { result } = renderHook(() => useApiError());
    const error: IApiError = {
      code: 'NETWORK_ERROR',
      message: 'Network Error',
    };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(window.location.href).not.toBe('/login');
    // No specific assertion since the implementation is empty
  });

  it('should log to console for other error codes', () => {
    // Arrange
    const { result } = renderHook(() => useApiError());
    const error: IApiError = { code: '500', message: 'Server Error' };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(console.error).toHaveBeenCalledWith('API Error:', error);
    expect(window.location.href).not.toBe('/login');
  });
});
