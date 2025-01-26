import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AccessTokenEntity } from '../../../database/entities/access.token.entity';

@Injectable()
export class AccessTokenRepository extends Repository<AccessTokenEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AccessTokenEntity, dataSource.manager);
  }

  public async deleteManyByParams(
    params: Partial<AccessTokenEntity>,
  ): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(AccessTokenEntity)
      .where(params)
      .execute();
  }

  async isAccessTokenExist(access_token: string): Promise<boolean> {
    return await this.exists({ where: { access_token } });
  }
}
