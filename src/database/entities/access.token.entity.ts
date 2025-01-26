import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AccessTokenID, UserID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.ACCESS_TOKENS)
export class AccessTokenEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: AccessTokenID;

  @Column('text')
  access_token: string;

  @Column('datetime')
  expires_at: Date;

  @Column()
  user_id: UserID;

  @ManyToOne(() => UserEntity, (entity) => entity.access_tokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
