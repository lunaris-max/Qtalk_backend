import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  createRoomMedia(
    params: {
      roomId: string;
      originalName?: string | null;
      resourceType: string;
      format: string;
      bytes: number;
      publicId: string;
      url: string;
      secureUrl: string;
    },
    prisma?: Prisma.TransactionClient,
  ) {
    const { roomId, ...data } = params;
    const client = prisma ?? this.prisma;

    return client.media.create({
      data: {
        roomId,
        ...data,
      },
      select: {
        id: true,
        originalName: true,
        resourceType: true,
        format: true,
        bytes: true,
        publicId: true,
        url: true,
        secureUrl: true,
        createdAt: true,
      },
    });
  }
}
