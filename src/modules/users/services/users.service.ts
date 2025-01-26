import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';

export interface UsersService {
  findMe(userData: IUserData): Promise<UserEntity>;
}
