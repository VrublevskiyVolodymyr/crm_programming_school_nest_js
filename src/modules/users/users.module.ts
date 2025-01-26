import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { UsersServiceImpl1 } from './services/users-impl1.service';
import { UsersServiceImpl2 } from './services/users-impl2.service';
import { UsersController } from './users.controller';

@Module({
  imports: [forwardRef(() => AuthModule), RepositoryModule],
  controllers: [UsersController],
  providers: [
    {
      provide: 'UsersService',
      useClass: UsersServiceImpl1,
    },
    UsersServiceImpl2,
  ],
  exports: [
    {
      provide: 'UsersService',
      useClass: UsersServiceImpl1,
    },
  ],
})
export class UsersModule {}
