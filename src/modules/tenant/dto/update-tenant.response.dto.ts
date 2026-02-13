import { ApiProperty } from '@nestjs/swagger';

export class UpdateTenantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;
}
