import { UserRoleEnum } from '../../enums/user-role.enum';

export class BaseUserResDto {
  id: string;

  name: string;

  surname: string;

  email: string;

  role?: UserRoleEnum;

  is_active?: boolean;

  is_superuser?: boolean;

  is_staff?: boolean;

  last_login?: Date;

  created_at?: Date;

  updated_at?: Date;
}
