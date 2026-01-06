import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthProvider } from '@prisma/client';
import { Strategy } from 'passport-facebook';

interface FacebookProfile {
  id: string;
  emails?: Array<{ value: string }>;
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('FACEBOOK_APP_ID'),
      clientSecret: config.getOrThrow<string>('FACEBOOK_APP_SECRET'),
      callbackURL: 'https://teamchallenge-chat-backend.onrender.com/v1/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: FacebookProfile) {
    return {
      provider: AuthProvider.FACEBOOK,
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
    };
  }
}
