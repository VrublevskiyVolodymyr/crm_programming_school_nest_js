import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { CommentResDto } from '../../../comments/dto/res/comment.res.dto';
import { GroupResDto } from '../../../groups/dto/res/group.res.dto';
import { AdminUserResDto } from '../../../users/dto/res/admin-user.res.dto';

export class BaseOrderDto {
  @ApiProperty({
    description: 'Unique identifier for the order',
    readOnly: true,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  id?: number;

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

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
    maxLength: 25,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Zа-яА-ЯЇЁіІё]*$/)
  @MaxLength(25)
  surname?: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
    maxLength: 100,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiProperty({
    description: "User's phone number",
    example: '+1234567890',
    maxLength: 12,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])*$/)
  @MaxLength(12)
  phone?: string;

  @ApiProperty({ description: "User's age", example: 25, maximum: 90 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(90)
  age?: number;

  @ApiProperty({
    description: "User's course",
    example: 'QACX',
    pattern: 'FS|QACX|JCX|JSCX|FE|PCX|^$',
  })
  @IsOptional()
  @IsString()
  @Matches(/FS|QACX|JCX|JSCX|FE|PCX|^$/)
  course?: string;

  @ApiProperty({
    description: "User's course format",
    example: 'online',
    pattern: 'static|online|^$',
  })
  @IsOptional()
  @IsString()
  @Matches(/static|online|^$/)
  course_format?: string;

  @ApiProperty({
    description: "User's course type",
    example: 'pro',
    pattern: 'pro|minimal|premium|incubator|vip|^$',
  })
  @IsOptional()
  @IsString()
  @Matches(/pro|minimal|premium|incubator|vip|^$/)
  course_type?: string;

  @ApiProperty({ description: 'Amount already paid by the user', example: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  alreadyPaid?: number;

  @ApiProperty({
    description: 'Total amount for course payment',
    example: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  sum?: number;

  @ApiProperty({
    description: "User's message",
    example: 'Thank you for registration!',
  })
  @IsOptional()
  @IsString()
  msg?: string;

  @ApiProperty({
    description: 'Order status',
    example: 'New',
    pattern: 'In work|New|Agree|Disagree|Dubbing|^$',
  })
  @IsOptional()
  @IsString()
  @Matches(/In work|New|Agree|Disagree|Dubbing|^$/)
  status?: string;

  @ApiProperty({ description: 'Manager information' })
  @IsOptional()
  @Type(() => AdminUserResDto)
  @ValidateNested()
  manager?: AdminUserResDto;

  @ApiProperty({
    description: 'Order creation date',
    example: '2024-01-01T12:00:00Z',
  })
  @IsOptional()
  created_at?: Date;

  @ApiProperty({
    description: "Order's UTM parameter",
    example: 'utm_source=google&utm_medium=cpc',
  })
  @IsOptional()
  @IsString()
  utm?: string;

  @ApiProperty({ description: 'List of comments' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CommentResDto)
  comments?: CommentResDto[];

  @ApiProperty({ description: 'Group information' })
  @IsOptional()
  @ValidateNested()
  @Type(() => GroupResDto)
  group?: GroupResDto;
}
