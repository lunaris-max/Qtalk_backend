import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

@Injectable()
export class TokensService {
  constructor(private readonly jwtService: JwtService) {}

  // ACCESS TOKEN
  generateAccessToken(payload: object, accessSecret: string): string {
    return this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: '15m',
    });
  }

  // REFRESH TOKEN
  async generateRefreshToken(): Promise<{
    refreshToken: string;
    refreshSecretHash: string;
  }> {
    const refreshToken = crypto.randomBytes(64).toString('hex');

    const refreshSecretHash = await bcrypt.hash(refreshToken, 10);

    return {
      refreshToken,
      refreshSecretHash,
    };
  }

  // COMPARE REFRESH TOKEN HASH
  async compareRefreshSecret(raw: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(raw, hashed);
  }

  // VERIFY JWT TOKEN
  verifyJwt<T = any>(token: string, secret: string): T | null {
    try {
      return this.jwtService.verify(token, { secret }) as T;
    } catch {
      return null;
    }
  }
}
