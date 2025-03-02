import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class GroupReqDto {
  @Transform(TransformHelper.trim)
  @IsString()
  @IsNotEmpty({ message: 'group name should not be empty' })
  @Type(() => String)
  name: string;
}
