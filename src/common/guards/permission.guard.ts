import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  RequiredPermissionConfig,
} from '../decorators/require-permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Permission } from '@prisma/client';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const config = this.reflector.getAllAndOverride<RequiredPermissionConfig>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('config');
    console.log(config);

    // Default deny
    if (!config) {
      throw new ForbiddenException('No permissions defined');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException('No permissions found');
    }

    const { permissions, selfParam } = config;

    const userPermissions: Permission[] = user.permissions;

    // 1️⃣ Перевірка full permissions
    const hasFullPermission = permissions.some((perm) => userPermissions.includes(perm));

    if (hasFullPermission) {
      return true;
    }

    // 2️⃣ Перевірка self permissions
    if (selfParam) {
      const paramValue = request.params?.[selfParam];

      if (!paramValue) {
        throw new ForbiddenException('Self param missing');
      }

      const isSelf = String(paramValue) === String(user.id);

      if (isSelf) {
        const selfPermissions = permissions.filter((perm) => perm.endsWith('.self'));

        const hasSelfPermission = selfPermissions.some((perm) => userPermissions.includes(perm));

        if (hasSelfPermission) {
          return true;
        }
      }
    }

    throw new ForbiddenException('Permission denied');
  }
}
