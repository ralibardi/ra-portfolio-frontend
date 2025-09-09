import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export interface IApiError {
  message: string;
  code: string;
  details?: unknown;
}

interface IErrorResponse {
  message?: string;
  [key: string]: unknown;
}

interface ICacheEntry {
  data: unknown;
  timestamp: number;
  expiry: number;
}

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private cache = new Map<string, ICacheEntry>();
  private readonly defaultCacheTime = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL as string,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      // Enable compression
      decompress: true,
      // Connection management
      maxRedirects: 3,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    this.setupInterceptors();
    this.setupPerformanceMonitoring();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracing
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Add cache control headers for GET requests
        if (config.method?.toLowerCase() === 'get') {
          config.headers['Cache-Control'] = 'max-age=300'; // 5 minutes
        }

        return config;
      },
      (error: unknown) =>
        Promise.reject(
          this.handleError(
            axios.isAxiosError(error) ? error : new AxiosError('Unknown error'),
          ),
        ),
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Cache GET responses
        if (response.config.method?.toLowerCase() === 'get') {
          this.cacheResponse(response.config.url || '', response.data);
        }
        return response;
      },
      (error: unknown) => {
        const axiosError = axios.isAxiosError(error) ? error : new AxiosError('Unknown error');
        
        // Retry logic for network errors
        if (axiosError.code === 'NETWORK_ERROR' && !axiosError.config?.retried) {
          axiosError.config!.retried = true;
          return this.axiosInstance.request(axiosError.config!);
        }

        return Promise.reject(this.handleError(axiosError));
      },
    );
  }

  private setupPerformanceMonitoring(): void {
    // Performance monitoring
    this.axiosInstance.interceptors.request.use((config) => {
      config.metadata = { startTime: Date.now() };
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => {
        const duration = Date.now() - response.config.metadata?.startTime;
        if (duration > 1000) {
          console.warn(`Slow API request: ${response.config.url} took ${duration}ms`);
        }
        return response;
      },
      (error) => {
        if (error.config) {
          const duration = Date.now() - error.config.metadata?.startTime;
          console.error(`Failed API request: ${error.config.url} took ${duration}ms`);
        }
        return Promise.reject(error);
      }
    );
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private cacheResponse(url: string, data: unknown): void {
    const cacheKey = this.getCacheKey(url);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + this.defaultCacheTime,
    });
  }

  private getCachedResponse<T>(url: string): T | null {
    const cacheKey = this.getCacheKey(url);
    const cached = this.cache.get(cacheKey);
    
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }
    
    if (cached) {
      this.cache.delete(cacheKey);
    }
    
    return null;
  }

  private getCacheKey(url: string): string {
    return btoa(url).replace(/[^a-zA-Z0-9]/g, '');
  }

  private handleError(error: AxiosError): IApiError {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const responseData = (error.response.data || {}) as IErrorResponse;
      return {
        message: responseData?.message || 'An error occurred',
        code: String(error.response.status),
        details: responseData,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'No response received from server',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Something happened in setting up the request
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig & { useCache?: boolean }): Promise<T> {
    // Check cache first for GET requests
    if (config?.useCache !== false) {
      const cached = this.getCachedResponse<T>(url);
      if (cached) {
        return cached;
      }
    }

    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    // Clear related cache entries
    this.invalidateCache(url);
    
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    // Clear related cache entries
    this.invalidateCache(url);
    
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // Clear related cache entries
    this.invalidateCache(url);
    
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  private invalidateCache(url: string): void {
    // Remove cache entries that might be affected by this mutation
    const baseUrl = url.split('?')[0].split('/').slice(0, -1).join('/');
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      try {
        const decodedKey = atob(key);
        if (decodedKey.includes(baseUrl)) {
          keysToDelete.push(key);
        }
      } catch {
        // Invalid base64, skip
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheSize(): number {
    return this.cache.size;
  }
}

export const apiClient = ApiClient.getInstance();
