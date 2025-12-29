import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus, Gender, InterestCategory } from '@prisma/client';
import { InterestDto } from 'src/interest/dto/interest.dto';

export class FullUserDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Unique user email',
  })
  email: string;

  @ApiProperty({
    example: 'user_login',
    description: 'Unique user login',
  })
  login: string;

  @ApiPropertyOptional({
    example: 'User',
    nullable: true,
    minLength: 3,
    maxLength: 20,
  })
  firstName: string | null;

  @ApiPropertyOptional({
    example: 'SecondUserName',
    nullable: true,
  })
  secondName: string | null;

  @ApiPropertyOptional({
    example: 'Description',
    nullable: true,
  })
  description: string | null;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/avatar.png',
    nullable: true,
  })
  avatar: string | null;

  @ApiPropertyOptional({
    example: 'dark',
    description: 'Profile UI theme',
    nullable: true,
  })
  profileTheme: string | null;

  @ApiPropertyOptional({
    example: 25,
    minimum: 0,
    nullable: true,
  })
  age: number | null;

  @ApiPropertyOptional({
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
  })
  accountStatus: AccountStatus;

  @ApiPropertyOptional({
    enum: Gender,
    example: Gender.MALE,
    nullable: true,
  })
  gender: Gender | null;

  @ApiProperty({
    example: '2025-01-10T12:00:00.000Z',
    description: 'User creation date',
  })
  createdAt: Date;
  @ApiProperty({
    type: [InterestDto],
    description: 'User interests',
  })

    @ApiProperty({
    enum: InterestCategory,
    description:
      'Available categories: OTHER, SPORT, MUSIC, IT, ART, GAMES, EDUCATION',
  })
  interests: InterestDto[]
}
