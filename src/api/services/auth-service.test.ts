import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../endpoints';
import {
  authService,
  type ILoginRequest,
  type ILoginResponse,
  type IRefreshTokenRequest,
} from './auth-service';

describe('AuthService', () => {
  const mockLoginResponse: ILoginResponse = {
    token: 'test-token',
    refreshToken: 'test-refresh-token',
    expiresIn: 3600,
  };

  let postSpy: jest.SpyInstance;
  beforeEach(() => {
    postSpy = jest.spyOn(apiClient, 'post');
    jest.clearAllMocks();
  });

  afterEach(() => {
    postSpy.mockRestore();
    jest.resetAllMocks();
  });

  describe('login', () => {
    it('should call apiClient.post with correct parameters', async () => {
      // Arrange
      const credentials: ILoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      postSpy.mockResolvedValueOnce(mockLoginResponse);

      // Act
      const result = await authService.login(credentials);

      // Assert
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGIN, credentials);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should propagate errors from the API', async () => {
      // Arrange
      const credentials: ILoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      const error = new Error('Invalid credentials');
      postSpy.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('refreshToken', () => {
    it('should call apiClient.post with correct parameters', async () => {
      // Arrange
      const request: IRefreshTokenRequest = {
        refreshToken: 'test-refresh-token',
      };
      postSpy.mockResolvedValueOnce(mockLoginResponse);

      // Act
      const result = await authService.refreshToken(request);

      // Assert
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.REFRESH_TOKEN, request);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('logout', () => {
    it('should call apiClient.post with correct parameters', async () => {
      // Arrange
      postSpy.mockResolvedValueOnce(undefined);

      // Act
      await authService.logout();

      // Assert
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGOUT);
    });
  });
});
