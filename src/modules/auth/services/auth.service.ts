import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserID } from '../../../common/types/entity-ids.type';
import { Config, EmailConfig } from '../../../config/config.types';
import { EmailService } from '../../email/email.service';
import { EmailTypeEnum } from '../../email/enums/email-type.enum';
import { ActionTokenRepository } from '../../repository/services/action-token.repository';
import { OldPasswordRepository } from '../../repository/services/old-password.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserRoleEnum } from '../../users/enums/user-role.enum';
import { UsersService } from '../../users/services/users.service';
import { UserMapper } from '../../users/user.mapper';
import { SignInReqDto } from '../dto/req/sign-in.req.dto';
import { SignUpReqDto } from '../dto/req/sign-up.req.dto';
import { AuthResDto, AuthSignUpResDto } from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { ActionTokenTypeEnum } from '../enums/action-token-type.enum';
import {
  IChangePassword,
  IResetPasswordSend,
  IResetPasswordSet,
  IUserData,
} from '../interfaces/user-data.interface';
import { AuthCacheService } from './auth-cache.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly emailConfig: EmailConfig;
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly actionTokenRepository: ActionTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly oldPasswordRepository: OldPasswordRepository,
    @Inject('UsersService') private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly emailService: EmailService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.emailConfig = this.configService.get<EmailConfig>('email');
  }

  public async signUp(dto: SignUpReqDto): Promise<AuthSignUpResDto> {
    await this.userService.isEmailExistOrThrow(dto.email);

    const password = await this.passwordService.hashPassword(dto.password);
    const device_id = dto.deviceId;

    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password, device_id }),
    );

    const actionToken = await this.tokenService.generateActionTokens(
      { userId: user.id, deviceId: dto.deviceId },
      ActionTokenTypeEnum.VERIFY_EMAIL,
    );
    await this.actionTokenRepository.save({
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
      user_id: user.id,
      device_id: dto.deviceId,
      actionToken,
    });

    await this.emailService.sendEmail(EmailTypeEnum.WELCOME, dto.email, {
      name: dto.firstName,
      actionToken: actionToken,
      frontUrl: this.emailConfig.frontendUrl,
    });

    return {
      user: UserMapper.toResponseDTO(user),
      message:
        'Account created! A verification email was sent to your inbox. Check it to activate your account.',
    };
  }

  async signUpOwner(dto: SignUpReqDto) {
    const existingOwner = await this.userRepository.findByRole(
      UserRoleEnum.ADMIN,
    );
    if (existingOwner) {
      throw new ConflictException(
        'Owner already exists. You can create only one owner.',
      );
    }
    const response = await this.signUp({
      ...dto,
      is_active: true,
      is_verified: true,
    });

    const tokens = await this.tokenService.generateAuthTokens({
      userId: response.user.id as UserID,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save({
        device_id: dto.deviceId,
        refreshToken: tokens.refreshToken,
        user_id: response.user.id as UserID,
      }),
      this.authCacheService.saveToken(
        tokens.accessToken,
        response.user.id as UserID,
        dto.deviceId,
      ),
    ]);

    return { user: response.user, tokens };
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true, is_verified: true, is_active: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.is_verified) {
      throw new UnauthorizedException(
        'Your account is not verified. Please check your email to verify your account.',
      );
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
      throw new UnauthorizedException();
    }
    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        device_id: dto.deviceId,
        user_id: user.id,
      }),
      this.authCacheService.deleteToken(user.id, dto.deviceId),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save({
        device_id: dto.deviceId,
        refreshToken: tokens.refreshToken,
        user_id: user.id,
      }),
      this.authCacheService.saveToken(
        tokens.accessToken,
        user.id,
        dto.deviceId,
      ),
    ]);
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    return { user: UserMapper.toResponseDTO(userEntity), tokens };
  }

  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        device_id: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);

    const tokens = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
      deviceId: userData.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save({
        device_id: userData.deviceId,
        refreshToken: tokens.refreshToken,
        user_id: userData.userId,
      }),
      this.authCacheService.saveToken(
        tokens.accessToken,
        userData.userId,
        userData.deviceId,
      ),
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
        device_id: userData.deviceId,
        user_id: userData.userId,
      }),
      this.actionTokenRepository.delete({
        device_id: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);
    await this.emailService.sendEmail(EmailTypeEnum.LOGOUT, userData.email, {
      name: user.firstName,
      frontUrl: this.emailConfig.frontendUrl,
    });
  }

  public async forgotPasswordSendEmail(dto: IResetPasswordSend): Promise<void> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const actionToken = await this.tokenService.generateActionTokens(
      { userId: user.id, deviceId: user.device_id },
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );

    await this.actionTokenRepository.save({
      actionToken,
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      user_id: user.id,
      device_id: user.device_id,
    });

    await this.emailService.sendEmail(
      EmailTypeEnum.FORGOT_PASSWORD,
      user.email,
      {
        frontUrl: this.emailConfig.frontendUrl,
        email: user.email,
        actionToken,
      },
    );
  }

  public async forgotPasswordSet(
    dto: IResetPasswordSet,
    userData: IUserData,
  ): Promise<void> {
    const password = await this.passwordService.hashPassword(dto.password);
    await this.userRepository.updateById(userData.userId, { password });

    await Promise.all([
      this.refreshTokenRepository.delete({
        device_id: userData.deviceId,
        user_id: userData.userId,
      }),
      this.actionTokenRepository.deleteManyByParams({
        user_id: userData.userId,
        type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);
  }

  public async verify(userData: IUserData): Promise<void> {
    await this.userRepository.updateById(userData.userId, {
      is_verified: true,
      is_active: true,
    });
    await this.actionTokenRepository.deleteManyByParams({
      user_id: userData.userId,
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
    });
  }

  public async changePassword(
    userData: IUserData,
    dto: IChangePassword,
  ): Promise<void> {
    const [user, oldPasswords] = await Promise.all([
      this.userRepository.findOne({
        where: { id: userData.userId },
        select: { password: true },
      }),
      this.oldPasswordRepository.findByParams(userData.userId),
    ]);
    const isPasswordCorrect = await this.passwordService.comparePassword(
      dto.oldPassword,
      'password' in user ? user.password : '',
    );
    if (!isPasswordCorrect) {
      throw new UnprocessableEntityException('Invalid previous password');
    }

    const passwords = [
      ...oldPasswords,
      { password: 'password' in user ? user.password : '' },
    ];
    await Promise.all(
      passwords.map(async (oldPassword) => {
        const isPrevious = await this.passwordService.comparePassword(
          dto.password,
          oldPassword.password,
        );
        if (isPrevious) {
          throw new UnprocessableEntityException('Password already used');
        }
      }),
    );

    const password = await this.passwordService.hashPassword(dto.password);
    await this.userRepository.updateById(userData.userId, { password });
    await this.oldPasswordRepository.save({
      user_id: userData.userId,
      password: 'password' in user ? user.password : '',
    });
    await Promise.all([
      this.refreshTokenRepository.delete({
        device_id: userData.deviceId,
        user_id: userData.userId,
      }),
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
    ]);
  }
}
