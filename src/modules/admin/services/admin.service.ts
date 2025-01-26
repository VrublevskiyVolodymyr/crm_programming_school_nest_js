import { UserID } from '../../../common/types/entity-ids.type';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import { UserQueryDto } from '../dto/req/user-query.dto';

export interface UsersService {
  findMe(userData: IUserData): Promise<UserEntity>;

  updateMe(userData: IUserData, dto: UpdateUserDto): Promise<UserEntity>;

  removeUser(userId: UserID): Promise<void>;

  findOne(userId: UserID): Promise<UserEntity>;

  isEmailExistOrThrow(email: string): Promise<void>;

  findByParams(query: UserQueryDto): Promise<UserEntity[]>;
}
