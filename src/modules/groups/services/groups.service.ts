import { BadRequestException, Injectable } from '@nestjs/common';

import { OrderMapper } from '../../orders/order.mapper';
import { GroupRepository } from '../../repository/services/group.repository';
import { GroupReqDto } from '../dto/req/group.req.dto';
import { GroupResDto } from '../dto/res/group.res.dto';

@Injectable()
export class GroupsService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async createGroup(dto: GroupReqDto): Promise<GroupResDto> {
    const groupExists = await this.groupRepository.existsBy({
      name: dto.name,
    });
    if (groupExists) {
      throw new BadRequestException({
        message: [`group with name "${dto.name}" already exists`],
      });
    }

    const newGroup = this.groupRepository.create({
      name: dto.name,
    });

    const savedGroup = await this.groupRepository.save(newGroup);

    return OrderMapper.mapToGroupResDto(savedGroup);
  }

  async getGroups(): Promise<GroupResDto[]> {
    const groups = await this.groupRepository.find();
    return groups.map((group) => OrderMapper.mapToGroupResDto(group));
  }
}
