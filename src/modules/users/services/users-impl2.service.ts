import { Injectable } from '@nestjs/common';

import { UserID } from '../../../common/types/entity-ids.type';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import { UsersService } from './users.service';
import { UserQueryDto } from "../dto/req/user-query.dto";

@Injectable()
export class UsersServiceImpl2 implements UsersService {
  findMe(userData: IUserData): Promise<UserEntity> {
    return Promise.resolve(undefined);
  }

  findOne(userId: UserID): Promise<UserEntity> {
    return Promise.resolve(undefined);
  }

  isEmailExistOrThrow(email: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  updateMe(userData: IUserData, dto: UpdateUserDto): Promise<UserEntity> {
    return Promise.resolve(undefined);
  }

  deleteAvatar(userData: IUserData): Promise<void> {
    return Promise.resolve(undefined);
  }

  uploadAvatar(
    userData: IUserData,
    avatar: Express.Multer.File,
  ): Promise<void> {
    return Promise.resolve(undefined);
  }

  removeUser(userId: UserID): Promise<void> {
    return Promise.resolve(undefined);
  }

  findByParams(query: UserQueryDto): Promise<UserEntity[]> {
    return Promise.resolve([]);
  }
}
