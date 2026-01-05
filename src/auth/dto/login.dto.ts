import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user_login',
    description: 'User login or username',
  })
  login: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description: 'User password',
    minLength: 6,
  })
  password: string;
}
