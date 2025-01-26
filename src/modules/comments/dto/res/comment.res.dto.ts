import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GroupResDto {
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
  name: string;
}
