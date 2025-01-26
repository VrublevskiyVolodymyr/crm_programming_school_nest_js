import { Global, Module } from '@nestjs/common';

import { AccessTokenRepository } from './services/access-token.repository';
import { ActionTokenRepository } from './services/action-token.repository';
import { CommentRepository } from './services/comment.repository';
import { GroupRepository } from './services/group.repository';
import { OrderRepository } from './services/order.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  RefreshTokenRepository,
  UserRepository,
  ActionTokenRepository,
  AccessTokenRepository,
  OrderRepository,
  GroupRepository,
  CommentRepository,
];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
