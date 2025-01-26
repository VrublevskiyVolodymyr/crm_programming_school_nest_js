import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UsersService } from './users.service';

@Injectable()
export class UsersServiceImpl2 implements UsersService {
  findMe(userData: IUserData): Promise<UserEntity> {
    return Promise.resolve(undefined);
  }
}
