import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayUnique, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SetUserInterestsDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of interest IDs',
  })
  @IsArray()
  @ArrayUnique()
  @Type(() => String)
  @IsInt({ each: true })
  interestIds: string[];
}
