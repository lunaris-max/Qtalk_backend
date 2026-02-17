import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTenantRequestDto {
  @ApiPropertyOptional({ description: 'tenant name' })
  name?: string;
}
