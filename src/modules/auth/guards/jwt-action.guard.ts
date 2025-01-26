import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ActionTokenRepository } from '../../repository/services/action-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserMapper } from '../../users/user.mapper';
import { ACTION_TOKEN_TYPE_KEY } from '../decorators/action-token-type.decorator';
import { ActionTokenTypeEnum } from '../enums/action-token-type.enum';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtActionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly actionTokenRepository: ActionTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const actionToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!actionToken) {
      throw new UnauthorizedException();
    }

    const tokenType = this.reflector.get<ActionTokenTypeEnum>(
      ACTION_TOKEN_TYPE_KEY,
      context.getHandler(),
    );
    if (!tokenType) {
      throw new UnauthorizedException('Action token type is missing');
    }

    const payload = await this.tokenService.verifyToken(actionToken, tokenType);

    if (!payload) {
      throw new UnauthorizedException();
    }

    const isActionTokenExist =
      await this.actionTokenRepository.isActionTokenExist(actionToken);
    if (!isActionTokenExist) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = UserMapper.toIUserData(user, payload);
    return true;
  }
}
