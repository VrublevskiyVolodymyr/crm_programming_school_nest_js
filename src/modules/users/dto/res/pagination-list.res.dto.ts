import { ApiProperty } from '@nestjs/swagger';

import { AdminUserResDto } from './admin-user.res.dto';

export class PaginationListResDto {
  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total_items: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  total_pages: number;

  @ApiProperty({
    description: 'Previous page number, if available',
    example: 1,
    nullable: true,
  })
  prev: number | null;

  @ApiProperty({
    description: 'Next page number, if available',
    example: 3,
    nullable: true,
  })
  next: number | null;

  @ApiProperty({
    description: 'List of users on the current page',
    type: [AdminUserResDto],
  })
  data: AdminUserResDto[];
}
