import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserID } from '../../common/types/entity-ids.type';
import { UserRoleEnum } from '../../modules/users/enums/user-role.enum';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { AccessTokenEntity } from './access.token.entity';
import { ActionTokenEntity } from './action.token.entity';
import { OrderEntity } from './order.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity(TableNameEnum.USERS)
export class UserEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: UserID;

  @Column('text')
  name: string;

  @Column('text')
  surname: string;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
  })
  role: UserRoleEnum;

  @OneToMany(() => AccessTokenEntity, (entity) => entity.user)
  access_tokens?: AccessTokenEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refresh_tokens?: RefreshTokenEntity[];

  @OneToMany(() => ActionTokenEntity, (entity) => entity.user)
  action_tokens?: ActionTokenEntity[];

  @OneToMany(() => OrderEntity, (order) => order.manager)
  orders?: OrderEntity[];

  @Column({
    type: 'datetime',
    nullable: true,
  })
  last_login?: Date;

  @Column('boolean', { default: false })
  is_active: boolean;

  @Column('boolean', { default: false })
  is_superuser: boolean;

  @Column('boolean', { default: false })
  is_staff: boolean;
}
