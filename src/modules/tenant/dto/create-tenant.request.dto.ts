import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTenantRequestDto {
  @ApiProperty({ description: 'tenant name' })
  @IsString()
  name: string;
}
