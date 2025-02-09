import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

import { BaseOrderDto } from './base-order.dto';

export class ExcelOrderDto extends PickType(BaseOrderDto, [
  'id',
  'surname',
  'age',
  'status',
  'course',
  'course_format',
  'course_type',
  'phone',
  'email',
  'alreadyPaid',
  'sum',
]) {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
    maxLength: 25,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Zа-яА-ЯЇЁіІё]*$/)
  @MaxLength(25)
  name?: string;

  @ApiProperty({ description: 'Order creation date' })
  @IsOptional()
  @Type(() => String)
  created_at?: string;

  @ApiProperty({ description: 'Group information' })
  @IsOptional()
  @Type(() => String)
  group?: string;

  @ApiProperty({ description: 'Manager name' })
  @IsOptional()
  @Type(() => String)
  manager?: string;
}
