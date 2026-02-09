import { BadRequestException, Injectable } from '@nestjs/common';
import type { Express } from 'express';

import { CloudinaryService } from '@src/infra/cloudinary/cloudinary.service';
import { MediaUploadResponseDto } from './dto/media-upload-response.dto';

@Injectable()
export class MediaService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFiles(files: Express.Multer.File[]): Promise<MediaUploadResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploads = files.map(async (file) => {
      const result = await this.cloudinaryService.uploadBuffer(file.buffer, {
        folder: 'chat/uploads',
        resource_type: 'auto',
      });

      return {
        originalName: file.originalname,
        resourceType: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
      };
    });

    return {
      files: await Promise.all(uploads),
    };
  }
}
