import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CommentReqDto {
  @Transform(TransformHelper.trim)
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  comment: string;
}
