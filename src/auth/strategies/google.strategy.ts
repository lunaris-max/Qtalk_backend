import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthProvider } from '@prisma/client';
import { Strategy } from 'passport-google-oauth20';

interface GoogleProfile {
  id: string;
  emails?: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'https://teamchallenge-chat-backend.onrender.com/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: GoogleProfile) {
    return {
      provider: AuthProvider.GOOGLE,
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
    };
  }
}
