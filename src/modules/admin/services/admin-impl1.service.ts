import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserID } from '../../../common/types/entity-ids.type';
import { Config } from '../../../config/config.types';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { AuthCacheService } from '../../auth/services/auth-cache.service';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import { UserQueryDto } from '../dto/req/user-query.dto';
import { UsersService } from './users.service';

@Injectable()
export class UsersServiceImpl1 implements UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authCacheService: AuthCacheService,
    private readonly configService: ConfigService<Config>,
  ) {}

  public async findMe(userData: IUserData): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userData.userId });
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    this.userRepository.merge(user, dto);
    return await this.userRepository.save(user);
  }

  public async removeUser(userId: UserID): Promise<void> {
    await this.userRepository.delete({ id: userId });
    await this.authCacheService.deleteToken(userId);
  }

  public async findOne(userId: UserID): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }

  public async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email already exists');
    }
  }

  findByParams(query: UserQueryDto): Promise<UserEntity[]> {
    return this.userRepository.findByParams(query);
  }
}
