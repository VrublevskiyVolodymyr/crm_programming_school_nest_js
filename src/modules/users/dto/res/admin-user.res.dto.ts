import { PickType } from '@nestjs/swagger';

import { BaseUserResDto } from './base-user.res.dto';

export class AdminUserResDto extends PickType(BaseUserResDto, [
  'id',
  'name',
  'surname',
  'email',
  'is_active',
  'last_login',
  'is_staff',
  'is_superuser',
]) {}
