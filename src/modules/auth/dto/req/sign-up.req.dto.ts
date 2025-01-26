import { ApiHideProperty, PickType } from '@nestjs/swagger';

import { UserRoleEnum } from '../../../users/enums/user-role.enum';
import { BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpReqDto extends PickType(BaseAuthReqDto, [
  'email',
  'password',
  'firstName',
  'lastName',
  'phone',
  'deviceId',
]) {
  @ApiHideProperty()
  roles?: UserRoleEnum[];

  @ApiHideProperty()
  public is_verified?: boolean;

  @ApiHideProperty()
  public is_active?: boolean;
}
