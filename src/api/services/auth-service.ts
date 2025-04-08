import { apiClient } from '../api-client';
import { getEndpoint } from '../endpoints';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(
      getEndpoint('AUTH', 'LOGIN'),
      credentials
    );
  }

  async refreshToken(request: RefreshTokenRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(
      getEndpoint('AUTH', 'REFRESH_TOKEN'),
      request
    );
  }

  async logout(): Promise<void> {
    return apiClient.post(getEndpoint('AUTH', 'LOGOUT'));
  }
}

export const authService = new AuthService();