import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatedRoomDto } from '../dto/created-room.dto';
import { AUTH_COOKIES } from '@src/modules/auth/constants/auth-cookies.constants';

export const CreateRoomDocs = () =>
  applyDecorators(
    ApiBearerAuth(AUTH_COOKIES.ACCESS_TOKEN),
    ApiOperation({
      summary: 'Create room',
      description:
        'Creates a new room and assigns the owner as a member. User must be authenticated and active.',
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
  );
