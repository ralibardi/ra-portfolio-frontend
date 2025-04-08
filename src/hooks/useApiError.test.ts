import { renderHook } from '@testing-library/react-hooks';
import { useApiError } from './useApiError';
import { ApiError } from '@api/api-client';

describe('useApiError', () => {
  // Save original window.location
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock window.location
    delete (window as any).location;
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
    const error: ApiError = { code: '401', message: 'Unauthorized' };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(window.location.href).toBe('/login');
  });

  it('should handle 403 forbidden errors', () => {
    // Arrange
    const { result } = renderHook(() => useApiError());
    const error: ApiError = { code: '403', message: 'Forbidden' };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(window.location.href).not.toBe('/login');
    // No specific assertion since the implementation is empty
  });

  it('should handle 404 not found errors', () => {
    // Arrange
    const { result } = renderHook(() => useApiError());
    const error: ApiError = { code: '404', message: 'Not Found' };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(window.location.href).not.toBe('/login');
    // No specific assertion since the implementation is empty
  });

  it('should handle 422 validation errors', () => {
    // Arrange
    const { result } = renderHook(() => useApiError());
    const error: ApiError = { code: '422', message: 'Validation Error' };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(window.location.href).not.toBe('/login');
    // No specific assertion since the implementation is empty
  });

  it('should handle network errors', () => {
    // Arrange
    const { result } = renderHook(() => useApiError());
    const error: ApiError = { code: 'NETWORK_ERROR', message: 'Network Error' };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(window.location.href).not.toBe('/login');
    // No specific assertion since the implementation is empty
  });

  it('should log to console for other error codes', () => {
    // Arrange
    const { result } = renderHook(() => useApiError());
    const error: ApiError = { code: '500', message: 'Server Error' };

    // Act
    result.current.handleApiError(error);

    // Assert
    expect(console.error).toHaveBeenCalledWith('API Error:', error);
    expect(window.location.href).not.toBe('/login');
  });
});
