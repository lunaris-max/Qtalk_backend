import { createParamDecorator, type ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const TenantId = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.tenantId) {
    throw new UnauthorizedException('Tenant not resolved');
  }

  return request.tenantId;
});
