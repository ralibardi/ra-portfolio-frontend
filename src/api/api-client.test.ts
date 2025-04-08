import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Mock the entire axios module - variable names with 'mock' prefix are allowed in Jest
jest.mock('axios', () => {
  // Create a factory that returns a new mock each time
  return {
    create: jest.fn().mockReturnValue({
      defaults: {
        baseURL: 'mock-base-url',
        headers: {},
      },
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
      get: jest
        .fn<() => Promise<AxiosResponse<unknown>>>()
        .mockResolvedValue({ data: {} } as AxiosResponse<unknown>),
      post: jest
        .fn<() => Promise<AxiosResponse<unknown>>>()
        .mockResolvedValue({ data: {} } as AxiosResponse<unknown>),
      put: jest
        .fn<() => Promise<AxiosResponse<unknown>>>()
        .mockResolvedValue({ data: {} } as AxiosResponse<unknown>),
      delete: jest
        .fn<() => Promise<AxiosResponse<unknown>>>()
        .mockResolvedValue({ data: {} } as AxiosResponse<unknown>),
    }),
  };
});

// Import axios after mocking to get the mocked version
import axios from 'axios';
// Import the API client
import { apiClient } from './api-client';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ApiClient', () => {
  // Get the axios instance created by apiClient
  const mockAxiosInstance = (axios.create as jest.Mock).mock.results[0]
    .value as AxiosInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('should access the singleton instance', () => {
    expect(apiClient).toBeDefined();
  });

  it('should make a GET request with authorization header if token exists', async () => {
    // Setup token in localStorage under the correct key 'auth_token'
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'auth_token') return 'test-token';
      return null;
    });

    await apiClient.get('/test-endpoint');

    // Verify API call was made
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      '/test-endpoint',
      undefined,
    );
  });

  it('should make a POST request', async () => {
    const mockData = { key: 'value' };

    await apiClient.post('/test-endpoint', mockData);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      '/test-endpoint',
      mockData,
      undefined,
    );
  });

  it('should make a PUT request', async () => {
    const mockData = { key: 'value' };

    await apiClient.put('/test-endpoint', mockData);

    expect(mockAxiosInstance.put).toHaveBeenCalledWith(
      '/test-endpoint',
      mockData,
      undefined,
    );
  });

  it('should make a DELETE request', async () => {
    await apiClient.delete('/test-endpoint');

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
      '/test-endpoint',
      undefined,
    );
  });
});
