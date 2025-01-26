import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './services/groups.service';

@Module({
  imports: [forwardRef(() => AuthModule), RepositoryModule],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
