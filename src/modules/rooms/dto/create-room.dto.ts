import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { RoomLanguage, RoomType } from '@prisma/client';

export class CreateRoomDto {
  @ApiProperty({
    example: 'Gaming Night',
    description: 'Room name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    enum: RoomType,
    example: RoomType.PUBLIC,
    description: 'Room type',
  })
  @IsEnum(RoomType)
  type: RoomType;

  @ApiPropertyOptional({
    example: 12,
    minimum: 12,
    maximum: 100,
    description: 'Minimum age restriction (default: 12)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(12)
  @Max(100)
  @IsOptional()
  minAge?: number;

  @ApiPropertyOptional({
    example: 100,
    minimum: 12,
    maximum: 100,
    description: 'Maximum age restriction (default: 100)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(12)
  @Max(100)
  @IsOptional()
  maxAge?: number;

  @ApiProperty({
    isArray: true,
    enum: RoomLanguage,
    example: [RoomLanguage.UK, RoomLanguage.EN],
    description: 'Room languages',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(RoomLanguage, { each: true })
  languages: RoomLanguage[];

  @ApiPropertyOptional({
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'Interest IDs (categories are derived from interests)',
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  @IsOptional()
  interestIds?: string[];
}
