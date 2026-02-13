import { Injectable, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TenantResolver {
  resolve(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest<Request>();

    // mock tenant
    const tenantId = 'default-tenant-id';

    (request as any).tenantId = tenantId;

    return tenantId;
  }
}
