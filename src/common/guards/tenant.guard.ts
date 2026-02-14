import { PrismaService } from '@db/prisma.service';
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { routesV1 } from '@src/config';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // skip checks for tenants paths
    const baseV1 = `/${routesV1.version}`;

    const ignoredPaths = [routesV1.tenant.root, routesV1.health.root].map(
      (route) => `${baseV1}/${route}`,
    );
    console.log(req.path);
    console.log(routesV1.tenant.root);
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
