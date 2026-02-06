import { ApiProperty } from '@nestjs/swagger';

export class MediaDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'room-photo.jpg' })
  originalName?: string | null;

  @ApiProperty({ example: 'image' })
  resourceType: string;

  @ApiProperty({ example: 'jpg' })
  format: string;

  @ApiProperty({ example: 345678 })
  bytes: number;

  @ApiProperty({ example: 'rooms/photos/abc123' })
  publicId: string;

  @ApiProperty({ example: 'http://res.cloudinary.com/demo/image/upload/v123/abc.jpg' })
  url: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/demo/image/upload/v123/abc.jpg' })
  secureUrl: string;

  @ApiProperty({ example: '2026-02-06T10:00:00.000Z' })
  createdAt: Date;
}
