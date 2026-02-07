import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, RoomMemberRole } from '@prisma/client';
import { CreatedRoomDto } from './created-room.dto';

export class RoomMemberDto {
  @ApiPropertyOptional({
    example: 'John',
  })
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
  })
  lastName?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/avatar.png',
  })
  avatar?: string;

  @ApiPropertyOptional({
    example: 25,
    minimum: 0,
  })
  age?: number;

  @ApiPropertyOptional({
    enum: Gender,
    example: Gender.MALE,
  })
  gender?: Gender;

  @ApiProperty({
    enum: RoomMemberRole,
    example: RoomMemberRole.MEMBER,
  })
  role: RoomMemberRole;
}

export class RoomDetailsDto extends CreatedRoomDto {
  @ApiProperty({
    type: [RoomMemberDto],
  })
  members: RoomMemberDto[];
}
