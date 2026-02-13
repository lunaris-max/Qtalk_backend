import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RequirePermissions } from '@src/common/decorators/require-permissions.decorator';
import { Permission } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AUTH_COOKIES } from '@src/modules/auth/constants/auth-cookies.constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiBearerAuth(AUTH_COOKIES.ACCESS_TOKEN)
  @RequirePermissions([Permission.USER_UPDATE, Permission.CHAT_MODERATE])
  getHello(): string {
    return this.appService.getHello();
  }
}
