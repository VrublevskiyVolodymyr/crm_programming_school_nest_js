import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from "class-validator";

import { AdminUserResDto } from '../../../users/dto/res/admin-user.res.dto';

export class CommentResDto {
  @ApiProperty({
    description: 'Unique identifier for the group',
    readOnly: true,
  })
  id: number;

  @ApiProperty({
    description: 'Group name',
    example: 'Marketing Team',
    maxLength: 128,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  comment: string;

  @ApiProperty({
    description: 'Unique identifier for the order',
    readOnly: true,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  order_id: number;

  @ApiProperty({ description: 'Manager information' })
  @IsOptional()
  @Type(() => AdminUserResDto)
  @ValidateNested()
  manager?: AdminUserResDto;

  @ApiProperty({
    description: 'Comment creation date',
    example: '2024-01-01T12:00:00Z',
  })
  @IsOptional()
  created_at?: Date;
}
