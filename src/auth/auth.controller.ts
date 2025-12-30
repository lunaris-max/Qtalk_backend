import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { routesV1 } from 'src/config/app.routes';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import type { Response, Request } from 'express';
import {
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PublicUserDto } from 'src/users/dto/public-user.dto';

@ApiTags('Auth')
@Controller(routesV1.version)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(routesV1.auth.root)
  @ApiOperation({
    summary: 'User registration',
    description:
      'Registers a new user. Access and refresh tokens are set as HttpOnly cookies.',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: PublicUserDto,
  })
  @ApiCookieAuth('access_token')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PublicUserDto> {
    const { user, accessToken, refreshToken } =
      await this.authService.register(dto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return user;
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token using refresh token cookie',
  })
  @ApiCookieAuth('refresh_token')
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    type: PublicUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PublicUserDto> {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await this.authService.refresh(refreshToken);

    // 🔐 access token
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 min
    });

    // 🔁 refresh token (rotation)
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return user;
  }
}
