import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { UserID } from '../../../common/types/entity-ids.type';
import { Config, JwtConfig } from '../../../config/config.types';
import { AccessTokenRepository } from '../../repository/services/access-token.repository';

@Injectable()
export class AuthCacheService {
  private jwtConfig: JwtConfig;

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly accessTokenRepository: AccessTokenRepository,
  ) {
    this.jwtConfig = this.configService.get('jwt');
  }

  public async saveToken(token: string, userId: UserID): Promise<void> {
    await this.accessTokenRepository.delete({ user_id: userId });

    const expiresAt = new Date(
      Date.now() + this.jwtConfig.accessExpiresIn * 1000,
    );
    const newToken = this.accessTokenRepository.create({
      access_token: token,
      user_id: userId,
      expires_at: expiresAt,
    });

    await this.accessTokenRepository.save(newToken);
  }

  public async isAccessTokenExist(
    userId: UserID,
    token: string,
  ): Promise<boolean> {
    const tokenEntity = await this.accessTokenRepository.findOne({
      where: { user_id: userId, access_token: token },
    });

    return !!tokenEntity && tokenEntity.expires_at > new Date();
  }

  public async deleteToken(userId: UserID): Promise<void> {
    await this.accessTokenRepository.delete({ user_id: userId });
  }
}
