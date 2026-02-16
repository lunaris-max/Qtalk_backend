import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Express } from 'express';

import { routesV1 } from '@src/config';
import { MediaService } from './media.service';
import { UploadMediaDocs } from './swagger-docs';
import { MediaUploadResponseDto } from './dto/media-upload-response.dto';
import { Public } from '@src/common/decorators';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

@ApiTags(routesV1.media.root)
@Public()
@Controller(routesV1.version)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post(routesV1.media.upload)
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILES, {
      storage: memoryStorage(),
      limits: {
        files: MAX_FILES,
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (_req, file, cb) => {
        const isImage = file.mimetype?.startsWith('image/');
        const isVideo = file.mimetype?.startsWith('video/');

        if (!isImage && !isVideo) {
          return cb(new BadRequestException('Only images and videos are allowed'), false);
        }

        return cb(null, true);
      },
    }),
  )
  @ApiExcludeEndpoint()
  @UploadMediaDocs()
  uploadMedia(@UploadedFiles() files: Express.Multer.File[]): Promise<MediaUploadResponseDto> {
    return this.mediaService.uploadFiles(files ?? []);
  }
}
