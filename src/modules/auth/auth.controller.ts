import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ActionTokenType } from './decorators/action-token-type.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { PasswordReqDto } from './dto/req/password.req.dto';
import { SignInReqDto } from './dto/req/sign-in.req.dto';
import { AuthResDto } from './dto/res/auth.res.dto';
import { TokenPairResDto } from './dto/res/token-pair.res.dto';
import { ActionTokenTypeEnum } from './enums/action-token-type.enum';
import { JwtActionGuard } from './guards/jwt-action.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { IUserData } from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ActionTokenType(ActionTokenTypeEnum.SET_PASSWORD)
  @UseGuards(JwtActionGuard)
  @SkipAuth()
  @ApiOperation({
    summary: 'Activate user',
    description: 'This endpoint allows activate user.',
  })
  @Post('activate')
  public async activate(
    @CurrentUser() userData: IUserData,
    @Body() password: PasswordReqDto,
  ): Promise<void> {
    return await this.authService.activate(userData, password);
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
}
