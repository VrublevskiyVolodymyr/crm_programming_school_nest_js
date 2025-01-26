import { ApiHideProperty, PickType } from '@nestjs/swagger';

import { UserRoleEnum } from '../../../users/enums/user-role.enum';
import { BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpReqDto extends PickType(BaseAuthReqDto, [
  'email',
  'name',
  'surname',
]) {
  @ApiHideProperty()
  role?: UserRoleEnum;

  @ApiHideProperty()
  public last_login?: Date;

  @ApiHideProperty()
  public is_active?: boolean;

  @ApiHideProperty()
  public is_superuser?: boolean;

  @ApiHideProperty()
  public is_stuff?: boolean;
}
