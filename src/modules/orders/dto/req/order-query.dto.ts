import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { IsDateYYYYMMDD } from '../../../../common/validators/date.validator';

export class OrderQueryDto {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: "User's phone number",
    example: '+1234567890',
    maxLength: 12,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: "User's age", example: 25, maximum: 90 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  age?: number;

  @ApiProperty({
    description: "User's course",
    example: 'QACX',
    pattern: 'FS|QACX|JCX|JSCX|FE|PCX|^$',
    enum: ['FS', 'QACX', 'JCX', 'JSCX', 'FE', 'PCX', ''],
  })
  @IsOptional()
  @IsString()
  @Matches(/FS|QACX|JCX|JSCX|FE|PCX|^$/)
  course?: string;

  @ApiProperty({
    description: "User's course format",
    example: 'online',
    pattern: 'static|online|^$',
    enum: ['static', 'online', ''],
  })
  @IsOptional()
  @IsString()
  @Matches(/static|online|^$/)
  course_format?: string;

  @ApiProperty({
    description: "User's course type",
    example: 'pro',
    pattern: 'pro|minimal|premium|incubator|vip|^$',
    enum: ['pro', 'minimal', 'premium', 'incubator', 'vip', ''],
  })
  @IsOptional()
  @IsString()
  @Matches(/pro|minimal|premium|incubator|vip|^$/)
  course_type?: string;

  @ApiProperty({
    description: 'Order status',
    example: 'New',
    pattern: 'In work|New|Agree|Disagree|Dubbing|^$',
    enum: ['In work', 'New', 'Agree', 'Disagree', 'Dubbing', ''],
  })
  @IsOptional()
  @IsString()
  @Matches(/In work|New|Agree|Disagree|Dubbing|^$/)
  status?: string;

  @ApiProperty({
    description: 'Filter by group name',
    example: 'Group_A',
    required: false,
  })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiProperty({
    description: 'Start date for filtering orders',
    example: '2025-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateYYYYMMDD('YYYY-MM-DD')
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering orders',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateYYYYMMDD('YYYY-MM-DD')
  endDate?: string;

  @ApiProperty({
    description: 'Whether to filter by current user',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  my?: boolean;

  @ApiProperty({
    description: 'Sort order ("id" asc or "-id" desc)',
    example: '-created_at',
    required: false,
  })
  @IsOptional()
  @IsString()
  order?: string;

  @ApiProperty({
    description: 'Limit number of results per page',
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;
}
