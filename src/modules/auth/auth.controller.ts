import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserRoleEnum } from '../users/enums/user-role.enum';
import { ActionTokenType } from './decorators/action-token-type.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { SignInReqDto } from './dto/req/sign-in.req.dto';
import { SignUpReqDto } from './dto/req/sign-up.req.dto';
import { SignUpEmployeeReqDto } from './dto/req/sign-up-employee.req.dto';
import { AuthResDto, AuthSignUpResDto } from './dto/res/auth.res.dto';
import { TokenPairResDto } from './dto/res/token-pair.res.dto';
import { ActionTokenTypeEnum } from './enums/action-token-type.enum';
import { JwtActionGuard } from './guards/jwt-action.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import {
  IChangePassword,
  IResetPasswordSend,
  IResetPasswordSet,
  IUserData,
} from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({
    summary: 'Sign up owner',
    description:
      'This endpoint allows the creation of a new owner with admin privileges, enabling the user to manage and oversee the system.',
  })
  @Post('sign-up-owner')
  public async signUpOwner(@Body() dto: SignUpReqDto): Promise<AuthResDto> {
    dto.roles = [UserRoleEnum.ADMIN];
    return await this.authService.signUpOwner(dto);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({
    summary: 'Sign up partner',
    description:
      'This endpoint allows an admin to create a new partner user, granting them admin privileges to manage the system.',
  })
  @Post('sign-up-partner')
  public async signUpPartner(
    @Body() dto: SignUpReqDto,
  ): Promise<AuthSignUpResDto> {
    dto.roles = [UserRoleEnum.ADMIN];
    return await this.authService.signUp(dto);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({
    summary: 'Sign up manager',
    description:
      'This endpoint is for admins to create manager accounts, allowing the user to manage various parts of the platform and oversee operations.',
  })
  @Post('sign-up-manager')
  public async signUpManager(
    @Body() dto: SignUpEmployeeReqDto,
  ): Promise<AuthSignUpResDto> {
    dto.roles = [UserRoleEnum.MANAGER];
    return await this.authService.signUp(dto);
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Sign up buyer',
    description:
      'This endpoint allows new users to sign up as buyers, giving them access to the platform to make purchases.',
  })
  @Post('sign-up-buyer')
  public async signUpBuyer(
    @Body() dto: SignUpReqDto,
  ): Promise<AuthSignUpResDto> {
    dto.roles = [UserRoleEnum.BUYER];
    return await this.authService.signUp(dto);
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Sign up seller',
    description:
      'This endpoint allows sellers to sign up and create an account, enabling them to offer products on the platform.',
  })
  @Post('sign-up-seller')
  public async signUpSeller(
    @Body() dto: SignUpEmployeeReqDto,
  ): Promise<AuthSignUpResDto> {
    dto.roles = [UserRoleEnum.SELLER];
    return await this.authService.signUp(dto);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Sign up mechanic',
    description:
      'This endpoint allows an admin or manager to register a mechanic to the platform, enabling them to assist with repairs or maintenance.',
  })
  @Post('sign-up-mechanic')
  public async signUpMechanic(
    @Body() dto: SignUpEmployeeReqDto,
  ): Promise<AuthSignUpResDto> {
    dto.roles = [UserRoleEnum.MECHANIC];
    return await this.authService.signUp(dto);
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Sign in',
    description:
      'This endpoint allows users to log in to the platform with their credentials, generating an authentication token.',
  })
  @Post('sign-in')
  public async signIn(@Body() dto: SignInReqDto): Promise<AuthResDto> {
    return await this.authService.signIn(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @SkipAuth()
  @ApiOperation({
    summary: 'Refresh token',
    description:
      'This endpoint allows the user to refresh their authentication token, granting them continued access to the platform.',
  })
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(userData);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Sign out',
    description:
      'This endpoint logs the user out, invalidating their authentication token and ending the session.',
  })
  @Post('sign-out')
  public async signOut(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.signOut(userData);
  }

  @SkipAuth()
  @ApiOperation({
    summary: 'Forgot password (send email)',
    description:
      'This endpoint sends an email with a password reset link to the user.',
  })
  @Post('forgot-password')
  public async forgotPasswordSendEmail(@Body() dto: IResetPasswordSend) {
    await this.authService.forgotPasswordSendEmail(dto);
  }

  @ApiBearerAuth()
  @SkipAuth()
  @ActionTokenType(ActionTokenTypeEnum.FORGOT_PASSWORD)
  @UseGuards(JwtActionGuard)
  @ApiOperation({
    summary: 'Forgot password (reset)',
    description:
      'This endpoint allows users to reset their password using the token from the reset email.',
  })
  @Put('forgot-password')
  public async forgotPasswordSet(
    @Body() dto: IResetPasswordSet,
    @CurrentUser() userData: IUserData,
  ) {
    await this.authService.forgotPasswordSet(dto, userData);
  }

  @ApiBearerAuth()
  @ActionTokenType(ActionTokenTypeEnum.VERIFY_EMAIL)
  @UseGuards(JwtActionGuard)
  @SkipAuth()
  @ApiOperation({
    summary: 'Verify email',
    description:
      'This endpoint allows users to verify their email address using a token sent to them.',
  })
  @Post('verify')
  public async verify(@CurrentUser() userData: IUserData) {
    return await this.authService.verify(userData);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password',
    description:
      'This endpoint allows the user to change their password by providing their current and new passwords.',
  })
  @Post('change-password')
  public async changePassword(
    @CurrentUser() userData: IUserData,
    @Body() dto: IChangePassword,
  ) {
    return await this.authService.changePassword(userData, dto);
  }
}
