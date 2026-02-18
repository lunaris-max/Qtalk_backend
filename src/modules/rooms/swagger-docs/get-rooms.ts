import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PaginatedRoomsDto } from '../dto/responses';
import { AUTH_COOKIES } from '@src/modules/auth/constants/auth-cookies.constants';

export const GetRoomsDocs = () =>
  applyDecorators(
    ApiBearerAuth(AUTH_COOKIES.ACCESS_TOKEN),
    ApiOperation({
      summary: 'Get rooms list',
      description:
        'Returns rooms list for the authenticated user (member or owner) with pagination and sorting.',
    }),
    ApiOkResponse({
      description: 'Rooms successfully retrieved',
      type: PaginatedRoomsDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. User must be authenticated.',
    }),
    ApiBadRequestResponse({
      description: 'Validation error in query parameters.',
    }),
  );
