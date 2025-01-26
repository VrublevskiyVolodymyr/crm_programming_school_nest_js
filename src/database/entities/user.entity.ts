import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DealershipID, UserID } from '../../common/types/entity-ids.type';
import { AccountTypeEnum } from '../../modules/users/enums/account-type.enum';
import { UserRoleEnum } from '../../modules/users/enums/user-role.enum';
import { TableNameEnum } from '../enums/table-name.enum';
import { CreateUpdateModel } from '../models/create-update.model';
import { ActionTokenEntity } from './action.token.entity';
import { AdvertisementEntity } from './advertisement.entity';
import { CarEntity } from './cars.entity';
import { DealershipEntity } from './dealership.entity';
import { OldPasswordEntity } from './old-password.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity(TableNameEnum.USERS)
export class UserEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: UserID;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { unique: true })
  device_id: string;

  @Column('text', { nullable: true, unique: true })
  phone?: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    array: true,
  })
  roles: UserRoleEnum[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => ActionTokenEntity, (entity) => entity.user)
  actionTokens: ActionTokenEntity[];

  @OneToMany(() => OldPasswordEntity, (entity) => entity.user)
  oldPasswords: OldPasswordEntity[];

  @OneToMany(() => CarEntity, (entity) => entity.user)
  cars: CarEntity[];

  @Column({
    type: 'enum',
    enum: AccountTypeEnum,
    default: AccountTypeEnum.BASIC,
  })
  accountType: AccountTypeEnum;

  @Column('boolean', { default: false })
  is_verified: boolean;

  @Column('boolean', { default: false })
  is_active: boolean;

  @Column('integer', { nullable: true })
  countOfAds: number;

  @OneToMany(() => AdvertisementEntity, (entity) => entity.user)
  advertisements: AdvertisementEntity[];

  @Column({ nullable: true })
  dealership_id?: DealershipID;

  @ManyToOne(() => DealershipEntity, (dealership) => dealership.employees, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dealership_id' })
  dealership?: DealershipEntity;
}
