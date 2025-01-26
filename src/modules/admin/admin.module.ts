import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminServiceImpl1 } from './services/admin-impl1.service';
import { AdminServiceImpl2 } from './services/admin-impl2.service';

@Module({
  imports: [forwardRef(() => AuthModule), RepositoryModule, UsersModule],
  controllers: [AdminController],
  providers: [
    {
      provide: 'AdminService',
      useClass: AdminServiceImpl1,
    },
    AdminServiceImpl2,
  ],
  exports: [
    {
      provide: 'AdminService',
      useClass: AdminServiceImpl1,
    },
  ],
})
export class AdminModule {}
