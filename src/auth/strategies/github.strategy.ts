import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthProvider } from '@prisma/client';
import { Strategy } from 'passport-github2';

interface GithubProfile {
  id: string;
  username: string;
  emails?: Array<{ value: string }>;
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: 'https://teamchallenge-chat-backend.onrender.com/v1/auth/github/callback',
      scope: ['user:email'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: GithubProfile) {
    return {
      provider: AuthProvider.GITHUB,
      providerId: profile.id,
      login: profile.username,
      email: profile.emails?.[0]?.value,
    };
  }
}
