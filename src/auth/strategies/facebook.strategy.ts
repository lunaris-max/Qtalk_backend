import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthProvider } from '@prisma/client';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('FACEBOOK_APP_ID'),
      clientSecret: config.get('FACEBOOK_APP_SECRET'),
      callbackURL: 'https://teamchallenge-chat-backend.onrender.com/v1/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
    });
  }

  async validate(_, __, profile: any) {
    return {
      provider: AuthProvider.FACEBOOK,
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
    };
  }
}
