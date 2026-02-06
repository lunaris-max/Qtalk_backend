import { ApiProperty } from '@nestjs/swagger';
import { UploadedFileDto } from './uploaded-file.dto';

export class MediaUploadResponseDto {
  @ApiProperty({ type: [UploadedFileDto] })
  files: UploadedFileDto[];
}
