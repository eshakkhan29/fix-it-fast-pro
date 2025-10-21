export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  UserId: string;
  Email: string;
  issued: string;
  expires: string;
}

// Legacy interface for backward compatibility
export interface LegacyTokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  expiresAt?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  roles?: any[];
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  issued?: string;
  expires?: string;
  accountId?: string;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface AuthSession {
  user: AuthenticatedUser | null;
  tokens: TokenResponse | null;
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  issued?: string;
  expires?: string;
  accountId?: string;
  roles?: any[];
}
