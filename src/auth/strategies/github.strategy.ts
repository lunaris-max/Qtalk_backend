import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthProvider } from '@prisma/client';
import { Strategy } from 'passport-github2';
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('GITHUB_CLIENT_ID'),
      clientSecret: config.get('GITHUB_CLIENT_SECRET'),
      callbackURL: 'https://teamchallenge-chat-backend.onrender.com/v1/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(_, __, profile: any) {
    return {
      provider: AuthProvider.GITHUB,
      providerId: profile.id,
      login: profile.username,
      email: profile.emails?.[0]?.value,
    };
  }
}
