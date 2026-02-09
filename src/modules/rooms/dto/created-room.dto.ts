import { ApiProperty } from '@nestjs/swagger';
import { RoomLanguage, RoomStatus, RoomType } from '@prisma/client';
import { InterestDto } from '@src/modules/interests/dto/interests.dto';
import { MediaDto } from './room-media.dto';

export class CreatedRoomDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Room ID (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'Gaming Night',
  })
  name: string;

  @ApiProperty({
    enum: RoomType,
    example: RoomType.PUBLIC,
  })
  type: RoomType;

  @ApiProperty({
    enum: RoomStatus,
    example: RoomStatus.ACTIVE,
  })
  status: RoomStatus;

  @ApiProperty({
    example: 12,
  })
  minAge: number;

  @ApiProperty({
    example: 100,
  })
  maxAge: number;

  @ApiProperty({
    isArray: true,
    enum: RoomLanguage,
    example: [RoomLanguage.UK, RoomLanguage.EN],
  })
  languages: RoomLanguage[];

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Owner user ID',
  })
  ownerId: string;

  @ApiProperty({
    type: [InterestDto],
  })
  interests: InterestDto[];

  @ApiProperty({
    type: [MediaDto],
  })
  media: MediaDto[];

  @ApiProperty({
    example: '2026-02-04T10:00:00.000Z',
  })
  createdAt: Date;
}
