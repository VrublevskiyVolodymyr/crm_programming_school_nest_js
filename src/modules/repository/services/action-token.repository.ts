import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ActionTokenEntity } from '../../../database/entities/action.token.entity';

@Injectable()
export class ActionTokenRepository extends Repository<ActionTokenEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ActionTokenEntity, dataSource.manager);
  }

  public async deleteManyByParams(
    params: Partial<ActionTokenEntity>,
  ): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(ActionTokenEntity)
      .where(params)
      .execute();
  }

  async isActionTokenExist(actionToken: string): Promise<boolean> {
    return await this.exists({ where: { actionToken } });
  }
}
