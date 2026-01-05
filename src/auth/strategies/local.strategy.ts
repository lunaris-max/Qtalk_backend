import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';

// strategies/local.strategy.ts
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    console.log('🔥 LocalStrategy initialized');
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string) {
    console.log(login);
    console.log(password);
    const user = await this.authService.validateLocal(login, password);
    console.log('user in local strategy');
    console.log(user);
    if (!user) {
      console.log('some user error');
      throw new UnauthorizedException();
    }
    return user;
  }
}
