import { PrismaService } from '@db/prisma.service';
import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';

@Injectable()
export class TenantUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async tenantExists(tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });
  }

  async userExists(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async findTenantUser(userId: string, tenantId: string) {
    return this.prisma.tenantUser.findUnique({
      where: {
        userId_tenantId: {
          userId,
          tenantId,
        },
      },
    });
  }

  async createTenantUser(userId: string, tenantId: string, permissions: Permission[]) {
    return this.prisma.tenantUser.create({
      data: {
        userId,
        tenantId,
        permissions: {
          create: permissions.map((permission) => ({
            permission,
          })),
        },
      },
      include: {
        permissions: true,
      },
    });
  }
}
