import { ApiProperty } from '@nestjs/swagger';

export class UpdateTenantDomainResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  domain: string;

  @ApiProperty()
  createdAt: Date;
}
