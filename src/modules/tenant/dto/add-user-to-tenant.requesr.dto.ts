import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@prisma/client';

export class AddUserToTenantDto {
  @ApiProperty({
    example: 'user-uuid',
    description: 'Existing user id',
  })
  userId: string;

  @ApiProperty({
    enum: Permission,
    isArray: true,
    required: false,
    example: ['TENANT_READ'],
  })
  permissions?: Permission[];
}
