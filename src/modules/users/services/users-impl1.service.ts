import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserID } from '../../../common/types/entity-ids.type';
import { AwsConfig, Config } from '../../../config/config.types';
import { UserEntity } from '../../../database/entities/user.entity';
import { ContentType } from '../../../file-storage/enums/content-type.enum';
import { FileStorageService } from '../../../file-storage/services/file-storage.service';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { AuthCacheService } from '../../auth/services/auth-cache.service';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import { UserQueryDto } from '../dto/req/user-query.dto';
import { UsersService } from './users.service';

@Injectable()
export class UsersServiceImpl1 implements UsersService {
  private readonly awsConfig: AwsConfig;
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly userRepository: UserRepository,
    private readonly authCacheService: AuthCacheService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.awsConfig = this.configService.get<AwsConfig>('aws');
  }

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
    const { device_id } = await this.userRepository.findOneBy({ id: userId });
    await this.userRepository.delete({ id: userId });
    await this.authCacheService.deleteToken(userId, device_id);
  }

  public async findOne(userId: UserID): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return {
      ...user,
      image: user.image ? `${this.awsConfig.bucketUrl}/${user.image}` : null,
    };
  }

  public async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email already exists');
    }
  }

  public async uploadAvatar(
    userData: IUserData,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const image = await this.fileStorageService.uploadFile(
      avatar,
      ContentType.AVATAR,
      userData.userId,
    );
    await this.userRepository.update(userData.userId, { image });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (user.image) {
      await this.fileStorageService.deleteFile(user.image);
      await this.userRepository.save(
        this.userRepository.merge(user, { image: null }),
      );
    }
  }

  findByParams(query: UserQueryDto): Promise<UserEntity[]> {
    return this.userRepository.findByParams(query);
  }
}
