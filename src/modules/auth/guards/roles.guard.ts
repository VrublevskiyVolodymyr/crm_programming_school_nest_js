import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRoleEnum } from '../../users/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRoleEnum[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!this.hasRequiredRoles(requiredRoles, user.roles)) {
      throw new ForbiddenException(
        'You do not have permission to access this endpoint',
      );
    }

    return true;
  }

  private hasRequiredRoles(
    requiredRoles: UserRoleEnum[],
    userRoles: UserRoleEnum[],
  ): boolean {
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
