import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UserRepository } from '../../repository/services/user.repository';
import { UsersService } from './users.service';

@Injectable()
export class UsersServiceImpl1 implements UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findMe(userData: IUserData): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userData.userId });
  }
}
