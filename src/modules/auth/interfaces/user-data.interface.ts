import { UserID } from '../../../common/types/entity-ids.type';
import { UserRoleEnum } from '../../users/enums/user-role.enum';

export interface IUserData {
  firstName?: string;
  userId: UserID;
  password?: string;
  deviceId: string;
  email: string;
  roles: UserRoleEnum[];
  is_verified?: boolean;
  is_active?: boolean;
}

export type IResetPasswordSend = Pick<IUserData, 'email'>;

export type IResetPasswordSet = Pick<IUserData, 'password'> & { token: string };

export type IChangePassword = Pick<IUserData, 'password'> & {
  oldPassword: string;
};
