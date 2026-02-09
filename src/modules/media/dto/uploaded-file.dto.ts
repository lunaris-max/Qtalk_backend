import { ApiProperty } from '@nestjs/swagger';

export class UploadedFileDto {
  @ApiProperty({ example: 'sample.jpg' })
  originalName: string;

  @ApiProperty({ example: 'image' })
  resourceType: string;

  @ApiProperty({ example: 'jpg' })
  format: string;

  @ApiProperty({ example: 345678 })
  bytes: number;

  @ApiProperty({ example: 'chat/uploads/abc123' })
  publicId: string;

  @ApiProperty({ example: 'http://res.cloudinary.com/demo/image/upload/v123/abc.jpg' })
  url: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/demo/image/upload/v123/abc.jpg' })
  secureUrl: string;
}
