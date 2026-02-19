import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ReportRoomDto {
  @ApiProperty({
    example: 'Spam or inappropriate content',
    description: 'Short reason for the report',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  reason: string;

  @ApiPropertyOptional({
    example: 'User is posting ads repeatedly',
    description: 'Optional additional details',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  details?: string;
}
