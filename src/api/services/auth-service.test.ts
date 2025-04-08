import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import {
  authService,
  ILoginRequest,
  ILoginResponse,
  IRefreshTokenRequest,
} from './auth-service';
import { apiClient } from '../api-client';
import { getEndpoint } from '../endpoints';

// Mock the apiClient
jest.mock('../api-client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

// Mock the getEndpoint function
jest.mock('../endpoints', () => ({
  getEndpoint: jest.fn(
    (category: string, endpoint: string) =>
      `/${category.toLowerCase()}/${endpoint.toLowerCase()}`,
  ),
}));

describe('AuthService', () => {
  const mockLoginResponse: ILoginResponse = {
    token: 'test-token',
    refreshToken: 'test-refresh-token',
    expiresIn: 3600,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('login', () => {
    it('should call apiClient.post with correct parameters', async () => {
      // Arrange
      const credentials: ILoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      (
        apiClient.post as jest.MockedFunction<typeof apiClient.post>
      ).mockResolvedValueOnce(mockLoginResponse);
      (
        getEndpoint as jest.MockedFunction<typeof getEndpoint>
      ).mockReturnValueOnce('/auth/login');

      // Act
      const result = await authService.login(credentials);

      // Assert
      expect(getEndpoint).toHaveBeenCalledWith('AUTH', 'LOGIN');
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should propagate errors from the API', async () => {
      // Arrange
      const credentials: ILoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      const error = new Error('Invalid credentials');
      (
        apiClient.post as jest.MockedFunction<typeof apiClient.post>
      ).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('refreshToken', () => {
    it('should call apiClient.post with correct parameters', async () => {
      // Arrange
      const request: IRefreshTokenRequest = {
        refreshToken: 'test-refresh-token',
      };
      (
        apiClient.post as jest.MockedFunction<typeof apiClient.post>
      ).mockResolvedValueOnce(mockLoginResponse);
      (
        getEndpoint as jest.MockedFunction<typeof getEndpoint>
      ).mockReturnValueOnce('/auth/refresh-token');

      // Act
      const result = await authService.refreshToken(request);

      // Assert
      expect(getEndpoint).toHaveBeenCalledWith('AUTH', 'REFRESH_TOKEN');
      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/refresh-token',
        request,
      );
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('logout', () => {
    it('should call apiClient.post with correct parameters', async () => {
      // Arrange
      (
        apiClient.post as jest.MockedFunction<typeof apiClient.post>
      ).mockResolvedValueOnce(undefined);
      (
        getEndpoint as jest.MockedFunction<typeof getEndpoint>
      ).mockReturnValueOnce('/auth/logout');

      // Act
      await authService.logout();

      // Assert
      expect(getEndpoint).toHaveBeenCalledWith('AUTH', 'LOGOUT');
      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    });
  });
});
