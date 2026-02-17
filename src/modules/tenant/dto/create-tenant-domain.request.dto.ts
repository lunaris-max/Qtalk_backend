import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTenantDomainRequestDto {
  @ApiProperty()
  @IsString()
  tenantId: string;

  @ApiProperty()
  @IsString()
  domain: string;
}
