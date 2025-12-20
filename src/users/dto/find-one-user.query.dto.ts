import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class FindOneUserQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  id?: number;

  @ApiPropertyOptional({ example: 'JohnDoe' })
  @IsString()
  @IsOptional()
  login?: string;

  @ApiPropertyOptional({ example: 'JohnDoe@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
}
