import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatedRoomDto } from '../dto/created-room.dto';
import { AUTH_COOKIES } from '@src/modules/auth/constants/auth-cookies.constants';
import { RoomLanguage, RoomType } from '@prisma/client';

export const CreateRoomDocs = () =>
  applyDecorators(
    ApiBearerAuth(AUTH_COOKIES.ACCESS_TOKEN),
    ApiOperation({
      summary: 'Create room',
      description:
        'Creates a new room and assigns the owner as a member. Optional image file (max 10MB). User must be authenticated and active.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Gaming Night' },
          type: {
            type: 'string',
            example: 'PUBLIC',
            description: `Allowed values: ${Object.values(RoomType).join(', ')}`,
          },
          minAge: { type: 'number', example: 12 },
          maxAge: { type: 'number', example: 100 },
          languages: {
            type: 'array',
            items: { type: 'string', example: 'EN' },
            description: `Allowed values: ${Object.values(RoomLanguage).join(', ')}`,
          },
          interestIds: {
            type: 'array',
            items: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
          },
          file: { type: 'string', format: 'binary' },
        },
        required: ['name', 'type', 'languages'],
      },
    }),
    ApiCreatedResponse({
      description: 'Room successfully created',
      type: CreatedRoomDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. User must be authenticated.',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden. User is not allowed to create rooms.',
    }),
    ApiNotFoundResponse({
      description: 'User not found or one or more interests not found.',
    }),
    ApiBadRequestResponse({
      description: 'Validation error or invalid age range.',
    }),
    ApiPayloadTooLargeResponse({
      description: 'File is too large. Max size is 10MB.',
    }),
  );
