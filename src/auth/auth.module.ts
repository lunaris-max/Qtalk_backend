import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UsersModule } from 'src/users/users.module';

import { AccessTokenService } from './access-token/access-token.service';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

/* strategies */
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule,

    UsersModule,
    RefreshTokenModule,

    PassportModule.register({
      session: false,
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,

    /* token services */
    AccessTokenService,

    /* passport strategies */
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    FacebookStrategy,
  ],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
