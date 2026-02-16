import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantRepository } from '@src/modules/tenant/repository/tenant.repository';
import { PrismaService } from '@db/prisma.service';
import { TenantUsersRepository } from '@src/modules/tenant/repository/tenant-users.repository';

@Module({
  controllers: [TenantController],
  providers: [TenantService, TenantRepository, PrismaService, TenantUsersRepository],
})
export class TenantModule {}
