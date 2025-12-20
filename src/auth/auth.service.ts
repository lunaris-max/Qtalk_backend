import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AccessTokenService } from './access-token/access-token.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    const accessToken = await this.accessTokenService.generate({
      sub: user.id,
      login: user.login,
    });

    const refreshToken = this.refreshTokenService.generate();

    await this.refreshTokenService.save(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
