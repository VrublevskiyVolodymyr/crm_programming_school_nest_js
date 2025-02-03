import { ApiProperty } from '@nestjs/swagger';

export class StatusCountDto {
  @ApiProperty({ description: 'Order status', example: 'New' })
  status: string;

  @ApiProperty({
    description: 'Number of orders with this status',
    example: 10,
  })
  count: number;
}

export class OrderStatisticsDto {
  @ApiProperty({ description: 'Total number of orders', example: 100 })
  total_count: number;

  @ApiProperty({
    description: 'Status statistics',
    type: () => [StatusCountDto],
  })
  statuses: StatusCountDto[];
}
