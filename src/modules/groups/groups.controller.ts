import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { GroupReqDto } from './dto/req/group.req.dto';
import { GroupResDto } from './dto/res/group.res.dto';
import { GroupsService } from './services/groups.service';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiBearerAuth()
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiOperation({
    summary: 'Create a group',
    description: 'Creates a specific group.',
  })
  @Post()
  async createGroup(@Body() dto: GroupReqDto): Promise<GroupResDto> {
    return await this.groupsService.createGroup(dto);
  }

  @ApiBearerAuth()
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiOperation({
    summary: 'Fetch a specific groups',
    description: 'Retrieves details of a specific groups',
  })
  @Get()
  async getGroups(): Promise<GroupResDto[]> {
    return await this.groupsService.getGroups();
  }
}
