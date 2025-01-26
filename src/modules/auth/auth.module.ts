import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './services/auth.service';
import { AuthCacheService } from './services/auth-cache.service';
import { PasswordService } from './services/password.service';
import { SeederAdminService } from './services/seeder.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [JwtModule, UsersModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthService,
    TokenService,
    AuthCacheService,
    PasswordService,
    SeederAdminService,
  ],
  exports: [AuthCacheService, PasswordService, TokenService],
})
export class AuthModule {}
