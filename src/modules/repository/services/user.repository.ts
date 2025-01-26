import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserID } from '../../../common/types/entity-ids.type';
import { UserEntity } from '../../../database/entities/user.entity';
import { TableNameEnum } from '../../../database/enums/table-name.enum';
import { IUserData } from '../../auth/interfaces/user-data.interface';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }

  public async updateById(
    userId: UserID,
    dto: Partial<IUserData>,
  ): Promise<UserEntity> {
    await this.update(userId, dto);
    return await this.findOneOrFail({ where: { id: userId } });
  }

  public async findByParams(
    queryParams: Record<string, any>,
  ): Promise<UserEntity[]> {
    const query = this.createQueryBuilder(TableNameEnum.USERS);

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'roles' && Array.isArray(value)) {
          query.andWhere(
            `"${TableNameEnum.USERS}".roles && ARRAY[:...${key}]::users_roles_enum[]`,
            {
              [key]: value,
            },
          );
        } else {
          query.andWhere(`${TableNameEnum.USERS}.${key} = :${key}`, {
            [key]: value,
          });
        }
      }
    });

    return await query.getMany();
  }

  public async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
  ): Promise<[UserEntity[], number]> {
    const query = this.createQueryBuilder(TableNameEnum.USERS);

    query.orderBy(`${TableNameEnum.USERS}.created_at`, 'DESC');

    query.skip((page - 1) * limit).take(limit);

    const [users, total] = await query.getManyAndCount();
    return [users, total];
  }
}
