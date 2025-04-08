import { apiClient } from '../api-client';
import { getEndpoint } from '../endpoints';

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

class AuthService {
  async login(credentials: ILoginRequest): Promise<ILoginResponse> {
    return apiClient.post<ILoginResponse>(
      getEndpoint('AUTH', 'LOGIN'),
      credentials,
    );
  }

  async refreshToken(request: IRefreshTokenRequest): Promise<ILoginResponse> {
    return apiClient.post<ILoginResponse>(
      getEndpoint('AUTH', 'REFRESH_TOKEN'),
      request,
    );
  }

  async logout(): Promise<void> {
    return apiClient.post(getEndpoint('AUTH', 'LOGOUT'));
  }
}

export const authService = new AuthService();
