import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from '@src/config';
import { AccessTokenPayload } from '@src/modules/auth/interfaces/access-token.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: AccessTokenPayload) {
    return {
      id: payload.sub,
      login: payload.login,
    };
  }
}
