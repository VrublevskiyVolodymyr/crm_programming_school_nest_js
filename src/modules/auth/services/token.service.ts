import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '@nestjs/jwt';

import { ActionConfig, Config, JwtConfig } from '../../../config/config.types';
import { ActionTokenTypeEnum } from '../enums/action-token-type.enum';
import { TokenType } from '../enums/token-type.enum';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { ITokenPair } from '../interfaces/token-pair.interface';

@Injectable()
export class TokenService {
  private readonly jwtConfig: JwtConfig;
  private readonly actionConfig: ActionConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get<JwtConfig>('jwt');
    this.actionConfig = this.configService.get<ActionConfig>('action');
  }

  public async generateAuthTokens(payload: IJwtPayload): Promise<ITokenPair> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accessSecret,
      expiresIn: this.jwtConfig.accessExpiresIn,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  public async verifyToken(
    token: string,
    type: TokenType | ActionTokenTypeEnum,
  ): Promise<IJwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.getSecret(type),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getSecret(type: TokenType | ActionTokenTypeEnum): string {
    let secret: string;
    switch (type) {
      case TokenType.ACCESS:
        secret = this.jwtConfig.accessSecret;
        break;
      case TokenType.REFRESH:
        secret = this.jwtConfig.refreshSecret;
        break;
      case ActionTokenTypeEnum.FORGOT_PASSWORD:
        secret = this.actionConfig.actionForgotPasswordSecret;
        break;
      case ActionTokenTypeEnum.VERIFY_EMAIL:
        secret = this.actionConfig.actionVerifyEmailSecret;
        break;

      default:
        throw new Error('Unknown token type');
    }
    return secret;
  }

  public async generateActionTokens(
    payload: IJwtPayload,
    tokenType: ActionTokenTypeEnum,
  ): Promise<string> {
    let secret: string;
    let expiresIn: number;

    switch (tokenType) {
      case ActionTokenTypeEnum.FORGOT_PASSWORD:
        secret = this.actionConfig.actionForgotPasswordSecret;
        expiresIn = this.actionConfig.actionForgotPasswordExpiration;
        break;
      case ActionTokenTypeEnum.VERIFY_EMAIL:
        secret = this.actionConfig.actionVerifyEmailSecret;
        expiresIn = this.actionConfig.actionVerifyEmailExpiration;
        break;
      default:
        throw new Error('Unknown token type');
    }

    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }
}
