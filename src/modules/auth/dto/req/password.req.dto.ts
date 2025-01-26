import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class PasswordReqDto {
  @ApiProperty({ example: '123qwe!@#QWE' })
  @Transform(TransformHelper.trim)
  @IsString()
  @Matches(/^(?=.*[a-zA-Zа-яА-ЯЇЁіІё])(?=.*\d)(?=.*[@#$%^&+=!])/)
  password: string;
}
