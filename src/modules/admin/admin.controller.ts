import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UserID } from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SignUpReqDto } from '../auth/dto/req/sign-up.req.dto';
import { ActionResDto } from '../auth/dto/res/token-pair.res.dto';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { OrderStatisticsDto } from '../orders/dto/res/order-statistic.res.dto';
import { PaginationQueryDto } from '../users/dto/req/pagination-query.dto';
import { AdminUserResDto } from '../users/dto/res/admin-user.res.dto';
import { PaginationListResDto } from '../users/dto/res/pagination-list.res.dto';
import { UserRoleEnum } from '../users/enums/user-role.enum';
import { AdminService } from './services/admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    @Inject('AdminService') private readonly adminService: AdminService,
  ) {}

  @ApiBearerAuth()
  @Roles('admin')
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiOperation({
    summary: 'Sign up manager',
    description:
      'This endpoint is for admins to create manager accounts, allowing the user to manage various parts of the platform and oversee operations.',
  })
  @Post('users')
  public async signUpManager(
    @Body() dto: SignUpReqDto,
  ): Promise<AdminUserResDto> {
    dto.role = UserRoleEnum.MANAGER;
    return await this.adminService.signUpManager(dto);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({
    summary: 'Get token',
    description:
      'This endpoint is for get some token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpb...',
  })
  @Post('users/:userId/re_token')
  public async requestToken(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<ActionResDto> {
    return await this.adminService.requestToken(userId);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({
    summary: 'Ban manager',
    description: 'This endpoint is for ban manager.',
  })
  @Patch('users/:userId/ban')
  public async banManager(
    @Param('userId', ParseUUIDPipe) userId: UserID,
    @CurrentUser() userData: IUserData,
  ): Promise<AdminUserResDto> {
    return await this.adminService.banManager(userId, userData);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({
    summary: 'Unban manager',
    description: 'This endpoint is for unban manager.',
  })
  @Patch('users/:userId/unban')
  public async unbanManager(
    @Param('userId', ParseUUIDPipe) userId: UserID,
    @CurrentUser() userData: IUserData,
  ): Promise<AdminUserResDto> {
    return await this.adminService.unbanManager(userId, userData);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({
    summary: 'Search Users',
    description:
      'Retrieves a paginated list of users based on the provided query parameters. Restricted to admin role.',
  })
  @Get('users')
  public async findAllWithPagination(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginationListResDto> {
    return await this.adminService.findAllWithPagination(query);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({
    summary: 'get all orders statistic',
    description: 'Get all orders statistic',
  })
  @Get('statistic/orders')
  public async getOrderStatistics(): Promise<OrderStatisticsDto> {
    return await this.adminService.getOrderStatistics();
  }

  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({
    summary: 'get all orders statistic',
    description: 'Get all orders statistic',
  })
  @Get('statistic/users/:userId')
  public async getManagerStatistics(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<OrderStatisticsDto> {
    return await this.adminService.getManagerStatistics(userId);
  }
}
