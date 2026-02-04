import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountStatus, Prisma, RoomLanguage, RoomMemberRole, RoomStatus } from '@prisma/client';
import { PrismaService } from '@db/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreatedRoomDto } from './dto/created-room.dto';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string | undefined, dto: CreateRoomDto): Promise<CreatedRoomDto> {
    if (!userId) {
      this.logger.warn('Room creation attempt without authentication');
      throw new UnauthorizedException('User is not authenticated');
    }

    this.logger.log(`Room creation started: userId=${userId}, name="${dto.name}"`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { accountStatus: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new ForbiddenException('User is not allowed to create rooms');
    }

    const minAge = dto.minAge ?? 12;
    const maxAge = dto.maxAge ?? 100;

    if (minAge > maxAge) {
      throw new BadRequestException('minAge cannot be greater than maxAge');
    }

    const languages: RoomLanguage[] = [...new Set(dto.languages)];
    const interestIds = [...new Set(dto.interestIds ?? [])];

    if (interestIds.length > 0) {
      const count = await this.prisma.interest.count({
        where: { id: { in: interestIds } },
      });

      if (count !== interestIds.length) {
        throw new NotFoundException('One or more interests not found');
      }
    }

    try {
      const created = await this.createRoomWithRelations({
        userId,
        dto,
        minAge,
        maxAge,
        languages,
        interestIds,
      });

      this.logger.log(`Room created: roomId=${created.id}, ownerId=${created.ownerId}`);

      return created;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.warn(
          `Room creation prisma error: code=${error.code}, userId=${userId}`,
        );

        if (error.code === 'P2002') {
          throw new ConflictException('Room already exists');
        }

        if (error.code === 'P2003') {
          throw new NotFoundException('User or interest not found');
        }
      }

      this.logger.error(
        `Room creation failed: userId=${userId}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }

  private async createRoomWithRelations(params: {
    userId: string;
    dto: CreateRoomDto;
    minAge: number;
    maxAge: number;
    languages: RoomLanguage[];
    interestIds: string[];
  }): Promise<CreatedRoomDto> {
    const { userId, dto, minAge, maxAge, languages, interestIds } = params;

    const room = await this.prisma.room.create({
      data: {
        name: dto.name.trim(),
        type: dto.type,
        status: RoomStatus.ACTIVE,
        minAge,
        maxAge,
        languages,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: RoomMemberRole.OWNER,
          },
        },
        interests: interestIds.length
          ? {
              create: interestIds.map((interestId) => ({
                interestId,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        minAge: true,
        maxAge: true,
        languages: true,
        ownerId: true,
        createdAt: true,
        interests: {
          select: {
            interest: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    return {
      id: room.id,
      name: room.name,
      type: room.type,
      status: room.status,
      minAge: room.minAge,
      maxAge: room.maxAge,
      languages: room.languages,
      ownerId: room.ownerId,
      interests: room.interests.map((ri) => ri.interest),
      createdAt: room.createdAt,
    };
  }
}
