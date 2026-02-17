import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma.service';
import { CreateTenantRequestDto } from '@src/modules/tenant/dto/create-tenant.request.dto';
import { UpdateTenantRequestDto } from '@src/modules/tenant/dto/update-tenant.request.dto';
import { CreateTenantDomainRequestDto } from '@src/modules/tenant/dto/create-tenant-domain.request.dto';
import { UpdateTenantDomainRequestDto } from '@src/modules/tenant/dto/update-tenant-domain.request.dto';

@Injectable()
export class TenantRepository {
  constructor(private prisma: PrismaService) {}

  // ===== Tenant CRUD =====
  createTenant(data: CreateTenantRequestDto) {
    return this.prisma.tenant.create({ data });
  }

  findAllTenants() {
    return this.prisma.tenant.findMany({ include: { domains: true, users: false } });
  }

  findTenantById(id: string) {
    return this.prisma.tenant.findUnique({
      where: { id },
      include: { domains: true, users: false },
    });
  }

  updateTenant(id: string, data: UpdateTenantRequestDto) {
    return this.prisma.tenant.update({ where: { id }, data });
  }

  deleteTenant(id: string) {
    return this.prisma.tenant.delete({ where: { id } });
  }

  // ===== TenantDomain CRUD =====
  createTenantDomain(data: CreateTenantDomainRequestDto) {
    return this.prisma.tenantDomain.create({ data });
  }

  findAllTenantDomains() {
    return this.prisma.tenantDomain.findMany({ include: { tenant: true } });
  }

  findTenantDomainById(id: string) {
    return this.prisma.tenantDomain.findUnique({ where: { id }, include: { tenant: true } });
  }

  updateTenantDomain(id: string, data: UpdateTenantDomainRequestDto) {
    return this.prisma.tenantDomain.update({ where: { id }, data });
  }

  deleteTenantDomain(id: string) {
    return this.prisma.tenantDomain.delete({ where: { id } });
  }
}
