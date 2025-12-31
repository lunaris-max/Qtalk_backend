import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
// import { Prisma } from '../../generated/prisma/client';
import { PublicUserDto } from './dto/public-user.dto';
// import { AccountStatus } from 'src/generated/enums';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { UserListItemDto } from './dto/user-list-item.dto';
import { FindOneUserQueryDto } from './dto/find-one-user.query.dto';
import { FullUserDto } from './dto/full-User.dto';
import { AccountStatus, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // async create(dto: CreateUserDto): Promise<PublicUserDto> {
  //   const hashedPassword = await bcrypt.hash(dto.password, 10);

  //   try {
  //     return await this.prisma.user.create({
  //       data: {
  //         login: dto.login,
  //         email: dto.email,
  //         password: hashedPassword,
  //         accountStatus: AccountStatus.ACTIVE,
  //         updatedAt: new Date(),
  //       },
  //       select: {
  //         id: true,
  //         login: true,
  //         email: true,
  //         createdAt: true,
  //         accountStatus: true,
  //       },
  //     });
  //   } catch (e) {
  //     if (e instanceof Prisma.PrismaClientKnownRequestError) {
  //       if (e.code === 'P2002') {
  //         throw new ConflictException('User already exists');
  //       }
  //     }
  //     throw e;
  //   }
  // }

  async create(dto: CreateUserDto): Promise<PublicUserDto> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          status: AccountStatus.ACTIVE,
          authMethods: {
            create: {
              provider: AuthProvider.LOCAL,
              providerId: dto.email, // або dto.login, якщо так вирішиш
              email: dto.email,
              passwordHash: hashedPassword,
            },
          },
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
      });

      return {
        id: user.id,
        accountStatus: user.status,
        createdAt: user.createdAt,
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException('User already exists');
        }
      }
      throw e;
    }
  }

  // find all
  async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<UserListItemDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          login: true,
          email: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // find one
  async findOne(query: FindOneUserQueryDto): Promise<FullUserDto> {
    const { id, login, email } = query;

    if (!id && !login && !email) {
      throw new BadRequestException('Provide at least one search parameter: id, login or email');
    }

    const or: Prisma.UserWhereInput[] = [];

    if (id) or.push({ id });
    if (login) or.push({ login });
    if (email) or.push({ email });

    const user = await this.prisma.user.findFirst({
      where: { OR: or },
      select: {
        id: true,
        email: true,
        login: true,
        firstName: true,
        secondName: true,
        description: true,
        avatar: true,
        profileTheme: true,
        age: true,
        accountStatus: true,
        gender: true,
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

    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(user);

    return {
      ...user,
      interests: user.interests.map((ui) => ui.interest),
    };
  }

  // update
  async update(id: number, dto: UpdateUserDto): Promise<FullUserDto> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields provided for update');
    }

    const data: Prisma.UserUpdateInput = {
      email: dto.email,
      login: dto.login,
      firstName: dto.firstName,
      secondName: dto.secondName,
      description: dto.description,
      avatar: dto.avatar,
      profileTheme: dto.profileTheme,
      age: dto.age,
      accountStatus: dto.accountStatus,
      gender: dto.gender,
      updatedAt: new Date(),
    };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    try {
      await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
        if (e.code === 'P2002') {
          throw new ConflictException('Email or login already exists');
        }
      }
      throw e;
    }

    // 🔽 ПОВЕРТАЄМО ПОВНОГО ЮЗЕРА З ІНТЕРЕСАМИ
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        login: true,
        firstName: true,
        secondName: true,
        description: true,
        avatar: true,
        profileTheme: true,
        age: true,
        accountStatus: true,
        gender: true,
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      interests: user.interests.map((ui) => ui.interest),
    };
  }

  // delete
  async delete(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }
      throw e;
    }
  }

  // set interest
  async setUserInterests(userId: number, interestIds: number[]) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (interestIds.length === 0) {
      await this.prisma.userInterest.deleteMany({
        where: { userId },
      });
      return { success: true };
    }

    const validCount = await this.prisma.interest.count({
      where: { id: { in: interestIds } },
    });

    if (validCount !== interestIds.length) {
      throw new NotFoundException('One or more interests not found');
    }

    await this.prisma.$transaction([
      this.prisma.userInterest.deleteMany({
        where: { userId },
      }),
      this.prisma.userInterest.createMany({
        data: interestIds.map((interestId) => ({
          userId,
          interestId,
        })),
      }),
    ]);

    return { success: true };
  }
}
