import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AUTH_COOKIES } from '@src/modules/auth/constants/auth-cookies.constants';

export const ReportRoomDocs = () =>
  applyDecorators(
    ApiBearerAuth(AUTH_COOKIES.ACCESS_TOKEN),
    ApiOperation({
      summary: 'Report room',
      description:
        'Creates a report for a room. Only room members can report. Rate limit: max 3 reports per hour.',
    }),
    ApiCreatedResponse({
      description: 'Report successfully created',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. User must be authenticated.',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden. User is not a room member.',
    }),
    ApiNotFoundResponse({
      description: 'Room not found.',
    }),
    ApiBadRequestResponse({
      description: 'Validation error.',
    }),
    ApiTooManyRequestsResponse({
      description: 'Rate limit exceeded.',
    }),
  );
