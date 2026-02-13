import { PrismaService } from '@db/prisma.service';
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // skip checks for tenants paths
    const ignoredPaths = ['/tenants', '/tenants/'];
    if (ignoredPaths.some((path) => req.path.startsWith(path))) {
      return true;
    }

    // get domain from headers
    const hostHeader = req.headers['x-forwarded-host'] || req.headers['host'];
    if (!hostHeader) throw new BadRequestException('Host header is missing');

    const domain = hostHeader.toString().toLowerCase();

    // find tenantDomain
    const tenantDomain = await this.prisma.tenantDomain.findUnique({
      where: { domain },
      include: { tenant: true },
    });

    if (!tenantDomain) throw new BadRequestException(`Tenant for domain ${domain} not found`);

    // add tenantId in request
    req.tenantId = tenantDomain.tenantId;

    return true;
  }
}
