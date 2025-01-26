import { UserID } from '../../../common/types/entity-ids.type';
import { UserRoleEnum } from '../../users/enums/user-role.enum';

export interface IUserData {
  name?: string;
  userId: UserID;
  password?: string;
  email: string;
  role: UserRoleEnum;
  last_login?: Date;
  is_active?: boolean;
  is_superuser?: boolean;
}
