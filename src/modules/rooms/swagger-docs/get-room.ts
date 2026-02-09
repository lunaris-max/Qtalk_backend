import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoomDetailsDto } from '../dto/responses';
import { AUTH_COOKIES } from '@src/modules/auth/constants/auth-cookies.constants';

export const GetRoomDocs = () =>
  applyDecorators(
    ApiBearerAuth(AUTH_COOKIES.ACCESS_TOKEN),
    ApiOperation({
      summary: 'Get room by id',
      description: 'Returns room details for room members only.',
    }),
    ApiParam({
      name: 'id',
      description: 'Room ID (UUID)',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiOkResponse({
      description: 'Room successfully retrieved',
      type: RoomDetailsDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. User must be authenticated.',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden. User is not allowed or not a room member.',
    }),
    ApiNotFoundResponse({
      description: 'User or room not found.',
    }),
    ApiBadRequestResponse({
      description: 'Invalid room id format.',
    }),
  );
