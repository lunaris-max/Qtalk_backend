import { ApiProperty } from '@nestjs/swagger';
import { RoomListItemDto } from './room-list-item.dto';

export class PaginatedRoomsDto {
  @ApiProperty({ type: [RoomListItemDto] })
  items: RoomListItemDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}
