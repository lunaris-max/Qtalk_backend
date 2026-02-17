import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { routesV1 } from '@src/config';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreatedRoomDto, PaginatedRoomsDto, RoomDetailsDto } from './dto/responses';
import { CreateRoomDocs, GetRoomDocs, GetRoomsDocs } from './swagger-docs';
import { GetRoomsQueryDto } from './dto/get-rooms.query.dto';
import { Public } from '@src/common/decorators';

@ApiTags(routesV1.rooms.root)
@Public()
@Controller(routesV1.version)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post(routesV1.rooms.create)
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        files: 1,
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (_req, file, cb) => {
        const isImage = file.mimetype?.startsWith('image/');
        if (!isImage) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        return cb(null, true);
      },
    }),
  )
  @CreateRoomDocs()
  create(
    @Req() req: Request,
    @Body() dto: CreateRoomDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<CreatedRoomDto> {
    const user = req.user as { id?: string } | undefined;
    return this.roomsService.create(user?.id, dto, file);
  }

  @Get(routesV1.rooms.findOne)
  @UseGuards(AuthGuard('jwt'))
  @GetRoomDocs()
  findOne(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RoomDetailsDto> {
    const user = req.user as { id?: string } | undefined;
    return this.roomsService.findOne(user?.id, id);
  }

  @Get(routesV1.rooms.findAll)
  @UseGuards(AuthGuard('jwt'))
  @GetRoomsDocs()
  findAll(@Query() query: GetRoomsQueryDto): Promise<PaginatedRoomsDto> {
    return this.roomsService.findAll(query);
  }
}
