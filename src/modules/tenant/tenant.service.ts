import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import {
  CreateTenantRequestDto,
  UpdateTenantRequestDto,
  CreateTenantDomainRequestDto,
  UpdateTenantDomainRequestDto,
} from '@src/modules/tenant/dto';
import { AddUserToTenantDto } from '@src/modules/tenant/dto/add-user-to-tenant.requesr.dto';
import { TenantUsersRepository } from '@src/modules/tenant/repository/tenant-users.repository';
import { TenantRepository } from '@src/modules/tenant/repository/tenant.repository';

@Injectable()
export class TenantService {
  constructor(
    private repo: TenantRepository,
    private readonly tenantUsersRepository: TenantUsersRepository,
  ) {}

  // Tenant
  createTenant(dto: CreateTenantRequestDto) {
    return this.repo.createTenant(dto);
  }
  getAllTenants() {
    return this.repo.findAllTenants();
  }
  getTenantById(id: string) {
    return this.repo.findTenantById(id);
  }
  updateTenant(id: string, dto: UpdateTenantRequestDto) {
    return this.repo.updateTenant(id, dto);
  }
  deleteTenant(id: string) {
    return this.repo.deleteTenant(id);
  }

  // TenantDomain
  createTenantDomain(dto: CreateTenantDomainRequestDto) {
    return this.repo.createTenantDomain(dto);
  }
  getAllTenantDomains() {
    return this.repo.findAllTenantDomains();
  }
  getTenantDomainById(id: string) {
    return this.repo.findTenantDomainById(id);
  }
  updateTenantDomain(id: string, dto: UpdateTenantDomainRequestDto) {
    return this.repo.updateTenantDomain(id, dto);
  }
  deleteTenantDomain(id: string) {
    return this.repo.deleteTenantDomain(id);
  }

  async addUserToTenant(tenantId: string, dto: AddUserToTenantDto) {
    const { userId, permissions = [] } = dto;

    const tenant = await this.tenantUsersRepository.tenantExists(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const user = await this.tenantUsersRepository.userExists(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.tenantUsersRepository.findTenantUser(userId, tenantId);

    if (existing) {
      throw new BadRequestException('User already in tenant');
    }

    return this.tenantUsersRepository.createTenantUser(userId, tenantId, permissions);
  }
}
