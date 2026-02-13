import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TenantResolver } from '../tenant/tenant.resolver';
import { PermissionGuard } from './permission.guard';
import { UserContextService } from '@src/modules/users/services/user-context.service';

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly tenantResolver: TenantResolver,
    private readonly permissionGuard: PermissionGuard,
    private readonly userContextService: UserContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // tenant resolve
    this.tenantResolver.resolve(context);

    // auth
    const isAuth = (await this.jwtAuthGuard.canActivate(context)) as boolean;

    if (!isAuth) return false;

    const jwtUser = request.user;

    const tenantId = 'mock';

    const fullUser = await this.userContextService.build(jwtUser.id, tenantId);

    request.user = fullUser;

    return this.permissionGuard.canActivate(context);
  }
}
