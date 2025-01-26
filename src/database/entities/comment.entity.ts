import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { OrderEntity } from './order.entity';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.COMMENTS)
export class CommentEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 255, nullable: false })
  comment: string;

  @Column('bigint', { name: 'order_id' })
  order_id: number;

  @Column()
  user_id: UserID;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    cascade: ['remove', 'update'],
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  manager: UserEntity;

  @ManyToOne(() => OrderEntity, (order) => order.id, {
    cascade: false,
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
