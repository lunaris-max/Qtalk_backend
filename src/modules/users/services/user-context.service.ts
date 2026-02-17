import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '@src/modules/users/repository/users.repository';

@Injectable()
export class UserContextService {
  constructor(private readonly userRepo: UsersRepository) {}

  async build(userId: string, tenantId: string) {
    const tenantUser = await this.userRepo.findByIdWithPermissions(userId, tenantId);

    if (!tenantUser) {
      throw new UnauthorizedException('User not found in tenant');
    }

    return {
      id: tenantUser.user.id,
      permissions: tenantUser.permissions.map((p) => p.permission),
    };
  }
}
