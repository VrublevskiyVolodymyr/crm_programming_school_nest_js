import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class SignInReqDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(0, 300)
  @Type(() => String)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/, {
    message: 'Wrong email or password',
  })
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @Transform(TransformHelper.trim)
  @Type(() => String)
  @IsString()
  @Matches(/^(?=.*[a-zA-Zа-яА-ЯЇЁіІё])(?=.*\d)(?=.*[@#$%^&+=!]).*$|^admin$/, {
    message: 'Wrong email or password',
  })
  public readonly password: string;
}
