import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    if (!user.login) {
      throw new UnauthorizedException('User login is missing');
    }

    const accessToken = this.accessTokenService.generate({
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

  // refresh
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    // check refresh token in Mongo
    const stored = await this.refreshTokenService.validate(refreshToken);

    // get user
    const user = await this.usersService.findOne({
      id: stored.userId,
    });

    if (!user.login) {
      throw new UnauthorizedException('User login is missing');
    }

    // new access token
    const accessToken = this.accessTokenService.generate({
      sub: user.id,
      login: user.login,
    });

    // rotation refresh token
    const newRefreshToken = await this.refreshTokenService.rotate(refreshToken, user.id);

    return {
      user,
      accessToken,
      accountStatus: user.accountStatus,
      refreshToken: newRefreshToken,
    };
  }
}
