import { PrismaService } from '@db/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, RoomLanguage, RoomMemberRole, RoomStatus } from '@prisma/client';
import { CreateRoomDto } from '../dto/create-room.dto';

@Injectable()
export class RoomsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserAccountStatus(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { accountStatus: true },
    });
  }

  async countInterestsByIds(interestIds: string[]) {
    return this.prisma.interest.count({
      where: { id: { in: interestIds } },
    });
  }

  async createRoomWithRelations(params: {
    userId: string;
    dto: CreateRoomDto;
    minAge: number;
    maxAge: number;
    languages: RoomLanguage[];
    interestIds: string[];
  }) {
    const { userId, dto, minAge, maxAge, languages, interestIds } = params;

    return this.prisma.room.create({
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
  }
}
