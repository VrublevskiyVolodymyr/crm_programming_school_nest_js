import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { IUserData } from '../auth/interfaces/user-data.interface';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { UserQueryDto } from './dto/req/user-query.dto';
import { PrivateUserResDto } from './dto/res/privat-user.res.dto';
import { UsersService } from './services/users.service';
import { UserMapper } from './user.mapper';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('UsersService') private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiOperation({
    summary: 'Get Current User Information',
    description:
      'Fetches detailed information about the currently authenticated user.',
  })
  @Get('me')
  public async findMe(
    @CurrentUser() userData: IUserData,
  ): Promise<PrivateUserResDto> {
    const result = await this.usersService.findMe(userData);
    return UserMapper.toResponseDTO(result);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Current User Information',
    description:
      'Updates the details of the currently authenticated user based on the provided data.',
  })
  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserDto,
  ): Promise<PrivateUserResDto> {
    const result = await this.usersService.updateMe(userData, dto);
    return UserMapper.toResponseDTO(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiConflictResponse({ description: 'Conflict' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete User by ID',
    description:
      'Deletes a user from the system based on their unique user ID. This action is restricted to admin and manager roles.',
  })
  @Delete(':userId')
  public async removeUser(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<void> {
    return await this.usersService.removeUser(userId);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Get User by ID',
    description:
      'Retrieves detailed information about a user by their unique user ID. Accessible to admin and manager roles.',
  })
  @Get(':userId')
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<PrivateUserResDto> {
    const result = await this.usersService.findOne(userId);
    return UserMapper.toResponseDTO(result);
  }

  @ApiBearerAuth()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Search Users',
    description:
      'Fetches a list of users based on the provided query parameters. Restricted to admin and manager roles.',
  })
  @Get()
  public async findByParams(
    @Query() query: UserQueryDto,
  ): Promise<PrivateUserResDto[]> {
    const result = await this.usersService.findByParams(query);
    return result.map((user) => UserMapper.toResponseDTO(user));
  }
}
