import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { OrderEntity } from './order.entity';

@Entity(TableNameEnum.GROUPS)
export class GroupEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 128, nullable: true })
  name?: string;

  @OneToMany(() => OrderEntity, (order) => order.group)
  orders?: OrderEntity[];
}
