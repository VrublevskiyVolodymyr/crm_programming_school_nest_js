import { Injectable } from '@nestjs/common';
import { DataSource, Raw, Repository } from 'typeorm';

import { UserID } from '../../../common/types/entity-ids.type';
import { UserEntity } from '../../../database/entities/user.entity';
import { TableNameEnum } from '../../../database/enums/table-name.enum';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UserRoleEnum } from '../../users/enums/user-role.enum';

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

  public async findByRole(role: UserRoleEnum): Promise<UserEntity | undefined> {
    return await this.createQueryBuilder(TableNameEnum.USERS)
      .where(`:role = ANY(${TableNameEnum.USERS}.roles)`, { role })
      .getOne();
  }

  public async findWithOutActivity(date: Date): Promise<UserEntity[]> {
    return await this.createQueryBuilder(TableNameEnum.USERS)
      .leftJoin(
        `${TableNameEnum.USERS}.refreshTokens`,
        'refreshToken',
        'refreshToken.createdAt > :date',
        { date },
      )
      .where('refreshToken.id IS NULL')
      .getMany();
  }
}
