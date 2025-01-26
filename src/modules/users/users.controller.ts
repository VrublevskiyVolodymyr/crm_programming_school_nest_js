import { Controller, Get, Inject } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { AdminUserResDto } from './dto/res/admin-user.res.dto';
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
  ): Promise<AdminUserResDto> {
    const result = await this.usersService.findMe(userData);
    return UserMapper.toAdminResponseDTO(result);
  }
}
