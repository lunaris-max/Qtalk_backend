import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoomLanguage, RoomMemberRole, RoomStatus, RoomType } from '@prisma/client';

export class RoomListMemberDto {
  @ApiPropertyOptional({ example: 'John' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.png' })
  avatar?: string;

  @ApiProperty({ enum: RoomMemberRole, example: RoomMemberRole.MEMBER })
  role: RoomMemberRole;
}

export class RoomListItemDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Room ID (UUID)',
  })
  id: string;

  @ApiProperty({ example: 'Gaming Night' })
  name: string;

  @ApiProperty({ enum: RoomType, example: RoomType.PUBLIC })
  type: RoomType;

  @ApiProperty({ enum: RoomStatus, example: RoomStatus.ACTIVE })
  status: RoomStatus;

  @ApiProperty({ example: 12 })
  minAge: number;

  @ApiProperty({ example: 100 })
  maxAge: number;

  @ApiProperty({
    isArray: true,
    enum: RoomLanguage,
    example: [RoomLanguage.UK, RoomLanguage.EN],
  })
  languages: RoomLanguage[];

  @ApiProperty({
    example: 'https://cdn.example.com/room.png',
    required: false,
  })
  photoUrl?: string | null;

  @ApiProperty({ example: 42 })
  membersCount: number;

  @ApiProperty({ type: [RoomListMemberDto] })
  members: RoomListMemberDto[];

  @ApiProperty({ example: '2026-02-04T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-17T10:00:00.000Z',
    required: false,
  })
  lastActivityAt?: Date | null;
}
