import { SetMetadata } from '@nestjs/common';
import { type Permission } from '@prisma/client';

export const PERMISSIONS_KEY = 'permissions';

export interface RequiredPermissionConfig {
  permissions: Permission[];
  selfParam?: string;
}

export const RequirePermissions = (permissions: Permission[], selfParam: string = 'id') => {
  if (!permissions.length) {
    throw new Error('RequirePermissions: permissions array cannot be empty');
  }

  return SetMetadata(PERMISSIONS_KEY, {
    permissions,
    selfParam,
  });
};
