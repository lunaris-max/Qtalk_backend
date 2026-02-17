import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDomainResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  domain: string;

  @ApiProperty()
  createdAt: Date;
}
