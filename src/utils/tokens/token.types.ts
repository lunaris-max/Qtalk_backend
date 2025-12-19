export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AccessToken {
  accessToken: string;
}

export interface RefreshTokenResult {
  refreshToken: string;
  refreshTokenHash: string;
}
