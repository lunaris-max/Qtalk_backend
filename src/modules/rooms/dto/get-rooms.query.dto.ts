import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '@src/common/dto/pagination-query.dto';
import { SortOrder } from '@prisma/client';

export enum RoomsSortBy {
  MembersCount = 'membersCount',
}

export class GetRoomsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: RoomsSortBy,
    example: RoomsSortBy.MembersCount,
    description: 'Sorting field',
  })
  @IsEnum(RoomsSortBy)
  @IsOptional()
  sort?: RoomsSortBy = RoomsSortBy.MembersCount;

  @ApiPropertyOptional({
    enum: SortOrder,
    example: SortOrder.desc,
    description: 'Sort order',
  })
  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder = SortOrder.desc;
}
