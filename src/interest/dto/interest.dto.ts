import { ApiProperty } from '@nestjs/swagger'
import { InterestCategory } from '@prisma/client'

export class InterestDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'Football' })
  name: string

  @ApiProperty({
    enum: InterestCategory,
    example: InterestCategory.SPORT,
  })
  category: InterestCategory
}
