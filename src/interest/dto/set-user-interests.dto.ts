import { ApiProperty } from '@nestjs/swagger'

export class SetUserInterestsDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of interest IDs',
  })
  interestIds: number[]
}
