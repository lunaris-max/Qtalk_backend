import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountStatus, Prisma, RoomLanguage } from '@prisma/client';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreatedRoomDto } from './dto/created-room.dto';
import { RoomsRepository } from './repository/rooms.repository';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(private readonly roomsRepository: RoomsRepository) {}

  async create(userId: string | undefined, dto: CreateRoomDto): Promise<CreatedRoomDto> {
    if (!userId) {
      this.logger.warn('Room creation attempt without authentication');
      throw new UnauthorizedException('User is not authenticated');
    }

    this.logger.log(`Room creation started: userId=${userId}, name="${dto.name}"`);

    const user = await this.roomsRepository.findUserAccountStatus(userId);

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
      const count = await this.roomsRepository.countInterestsByIds(interestIds);

      if (count !== interestIds.length) {
        throw new NotFoundException('One or more interests not found');
      }
    }

    try {
      const created = await this.roomsRepository.createRoomWithRelations({
        userId,
        dto,
        minAge,
        maxAge,
        languages,
        interestIds,
      });

      this.logger.log(`Room created: roomId=${created.id}, ownerId=${created.ownerId}`);

      return {
        id: created.id,
        name: created.name,
        type: created.type,
        status: created.status,
        minAge: created.minAge,
        maxAge: created.maxAge,
        languages: created.languages,
        ownerId: created.ownerId,
        interests: created.interests.map((ri) => ri.interest),
        createdAt: created.createdAt,
      };
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

}
