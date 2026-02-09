import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
} from '@nestjs/swagger';

import { MediaUploadResponseDto } from '../dto/media-upload-response.dto';

export const UploadMediaDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Upload media files',
      description: 'Uploads up to 10 files (images or videos). Max size: 10MB per file.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
        required: ['files'],
      },
    }),
    ApiCreatedResponse({
      description: 'Files uploaded',
      type: MediaUploadResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'No files provided or unsupported file type.',
    }),
    ApiPayloadTooLargeResponse({
      description: 'File is too large. Max size is 10MB per file.',
    }),
  );
