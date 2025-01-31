import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Matches, MaxLength } from 'class-validator';

import { BaseOrderDto } from './base-order.dto';

export class EditOrderDto extends PickType(BaseOrderDto, [
  'name',
  'surname',
  'age',
  'status',
  'course',
  'course_format',
  'course_type',
  'phone',
  'alreadyPaid',
  'sum',
]) {
  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
    maxLength: 100,
  })
  @IsOptional()
  @Matches(/^$|^([\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/)
  @MaxLength(100)
  email?: string;

  @ApiProperty({ description: 'Group information' })
  @IsOptional()
  @Type(() => String)
  group?: string;
}
