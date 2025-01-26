import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

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
    description: 'Comment creation date',
    example: '2024-01-01T12:00:00Z',
  })
  @IsOptional()
  created_at?: Date;
}
