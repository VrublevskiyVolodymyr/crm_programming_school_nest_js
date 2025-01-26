import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ActionTokenID, UserID } from '../../common/types/entity-ids.type';
import { ActionTokenTypeEnum } from '../../modules/auth/enums/action-token-type.enum';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.ACTION_TOKENS)
export class ActionTokenEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: ActionTokenID;

  @Column('text', { nullable: true })
  action_token: string;

  @Column('text')
  type: ActionTokenTypeEnum;

  @Column()
  user_id: UserID;
  @ManyToOne(() => UserEntity, (entity) => entity.action_tokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
