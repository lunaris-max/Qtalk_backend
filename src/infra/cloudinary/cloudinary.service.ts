import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from 'cloudinary';

import { cloudinaryConfig } from '@src/config';

@Injectable()
export class CloudinaryService {
  private isConfigured = false;

  private ensureConfigured() {
    if (this.isConfigured) return;

    cloudinary.config({
      cloudinary_url: cloudinaryConfig.url,
    });

    this.isConfigured = true;
  }

  uploadBuffer(buffer: Buffer, options: UploadApiOptions = {}): Promise<UploadApiResponse> {
    this.ensureConfigured();

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          ...options,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error('Cloudinary upload failed'));
          }

          return resolve(result);
        },
      );

      stream.end(buffer);
    });
  }
}
