import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UnauthorizedException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
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
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { PublicUserDto } from 'src/users/dto/public-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller(routesV1.version)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // =========================
  // REGISTER (LOCAL)
  // =========================
  @Post(routesV1.auth.root)
  @ApiOperation({
    summary: 'Register user (local)',
    description:
      'Creates a new user with local credentials. Access and refresh tokens are returned via HttpOnly cookies.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: PublicUserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Registration failed' })
  @ApiCookieAuth('access_token')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PublicUserDto> {
    const { user, accessToken, refreshToken } = await this.authService.register(dto);

    this.setAuthCookies(res, accessToken, refreshToken);
    return user;
  }

  // =========================
  // REFRESH TOKEN
  // =========================
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Issues a new access token using a valid refresh token from cookies.',
  })
  @ApiCookieAuth('refresh_token')
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    type: PublicUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing refresh token',
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

    this.setAuthCookies(res, accessToken, newRefreshToken);
    return user;
  }

  // =========================
  // LOGIN (LOCAL)
  // =========================
  @Post(`${routesV1.auth.root}/login`)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: 'Login with local credentials',
    description:
      'Authenticates user using login and password. Access and refresh tokens are returned via HttpOnly cookies.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Successfully authenticated',
    type: PublicUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid login or password',
  })
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    console.log('🔥 LOGIN CONTROLLER HIT');
    console.log(req.user);
    this.authService.issueTokens(req.user, res);
    return req.user;
  }

  // =========================
  // GOOGLE AUTH
  // =========================
  @Get(`${routesV1.auth.google}`)
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth redirect',
    description: 'Redirects user to Google OAuth consent screen.',
  })
  // @ApiExcludeEndpoint()
  google() {}

  @Get(`${routesV1.auth.google}/callback`)
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth callback',
    description:
      'Handles Google OAuth response, logs in or creates user, sets cookies and redirects to frontend.',
  })
  // @ApiExcludeEndpoint()
  async googleCallback(@Req() req, @Res() res: Response) {
    const user = await this.authService.loginSocial(req.user);

    this.authService.issueTokens(
      {
        id: user.id,
        identifier: req.user.email,
      },
      res,
    );

    res.redirect(this.configService.getOrThrow<string>('FRONTEND_URL'));
  }

  // =========================
  // GITHUB AUTH
  // =========================
  @Get(`${routesV1.auth.github}`)
  @UseGuards(AuthGuard('github'))
  @ApiOperation({
    summary: 'GitHub OAuth redirect',
    description: 'Redirects user to GitHub OAuth consent screen.',
  })
  // @ApiExcludeEndpoint()
  github() {}

  @Get(`${routesV1.auth.github}/callback`)
  @UseGuards(AuthGuard('github'))
  @ApiOperation({
    summary: 'GitHub OAuth callback',
    description:
      'Handles GitHub OAuth response, logs in or creates user, sets cookies and redirects.',
  })
  // @ApiExcludeEndpoint()
  async githubCallback(@Req() req, @Res() res: Response) {
    const user = await this.authService.loginSocial(req.user);

    this.authService.issueTokens(
      {
        id: user.id,
        identifier: req.user.email,
      },
      res,
    );

    res.redirect(this.configService.getOrThrow<string>('FRONTEND_URL'));
  }

  // =========================
  // FACEBOOK AUTH
  // =========================
  @Get(`${routesV1.auth.facebook}`)
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({
    summary: 'Facebook OAuth redirect',
    description: 'Redirects user to Facebook OAuth consent screen.',
  })
  // @ApiExcludeEndpoint()
  facebook() {}

  @Get(`${routesV1.auth.facebook}/callback`)
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({
    summary: 'Facebook OAuth callback',
    description:
      'Handles Facebook OAuth response, logs in or creates user, sets cookies and redirects.',
  })
  // @ApiExcludeEndpoint()
  async facebookCallback(@Req() req, @Res() res: Response) {
    const user = await this.authService.loginSocial(req.user);

    this.authService.issueTokens(
      {
        id: user.id,
        identifier: req.user.email,
      },
      res,
    );

    res.redirect(this.configService.getOrThrow<string>('FRONTEND_URL'));
  }

  // =========================
  // HELPERS
  // =========================
  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
