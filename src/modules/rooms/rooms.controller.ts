import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

import { routesV1 } from '@src/config';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreatedRoomDto } from './dto/created-room.dto';
import { AUTH_COOKIES } from '@src/modules/auth/constants/auth-cookies.constants';
import { CreateRoomDocs } from './swagger-docs';

@ApiTags(routesV1.rooms.root)
@Controller(routesV1.version)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post(routesV1.rooms.create)
  @UseGuards(AuthGuard('jwt'))
  @CreateRoomDocs()
  create(@Req() req: Request, @Body() dto: CreateRoomDto)
    : Promise<CreatedRoomDto>
  {
    const user = req.user as { id?: string } | undefined;
    return this.roomsService.create(user?.id, dto);
  }
}
