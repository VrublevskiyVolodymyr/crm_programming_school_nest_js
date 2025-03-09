import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Config } from '../../../config/config.types';
import { ActionTokenRepository } from '../../repository/services/action-token.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UsersService } from '../../users/services/users.service';
import { PasswordReqDto } from '../dto/req/password.req.dto';
import { SignInReqDto } from '../dto/req/sign-in.req.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { ActionTokenTypeEnum } from '../enums/action-token-type.enum';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthCacheService } from './auth-cache.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly actionTokenRepository: ActionTokenRepository,
    private readonly userRepository: UserRepository,
    @Inject('UsersService') private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService<Config>,
  ) {}

  public async signIn(dto: SignInReqDto): Promise<TokenPairResDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true, is_active: true },
    });
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedException(
        'Your account is deactivated. Please contact support.',
      );
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: user.id,
      }),
      this.authCacheService.deleteToken(user.id),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save({
        refresh_token: tokens.refreshToken,
        user_id: user.id,
      }),
      this.authCacheService.saveToken(tokens.accessToken, user.id),
    ]);
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    userEntity.last_login = new Date(Date.now());
    await this.userRepository.save(userEntity);
    return { ...tokens };
  }

  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId),
    ]);

    const tokens = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
    });

    await Promise.all([
      this.refreshTokenRepository.save({
        refresh_token: tokens.refreshToken,
        user_id: userData.userId,
      }),
      this.authCacheService.saveToken(tokens.accessToken, userData.userId),
    ]);

    return tokens;
  }

  public async signOut(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: userData.userId,
      }),
      this.actionTokenRepository.delete({
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId),
    ]);
  }

  public async activate(
    userData: IUserData,
    password: PasswordReqDto,
  ): Promise<void> {
    const hashPassword = await this.passwordService.hashPassword(
      password.password,
    );
    await this.userRepository.updateById(userData.userId, {
      is_active: true,
      password: hashPassword,
    });
    await this.actionTokenRepository.deleteManyByParams({
      user_id: userData.userId,
      type: ActionTokenTypeEnum.SET_PASSWORD,
    });
  }
}
