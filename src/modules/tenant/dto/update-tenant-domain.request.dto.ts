import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTenantDomainRequestDto {
  @ApiPropertyOptional({ description: 'new domain name' })
  domain?: string;
}
