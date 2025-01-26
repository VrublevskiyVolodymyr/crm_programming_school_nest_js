import { IsOptional, IsPositive, Matches, Max } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from '../enums/table-name.enum';
import { CommentEntity } from './comment.entity';
import { GroupEntity } from './group.entity';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.ORDERS)
export class OrderEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('varchar', { length: 25, nullable: true })
  @Matches(/^[a-zA-Zа-яА-ЯЇЁіІё]*$/)
  @IsOptional()
  name?: string;

  @Column('varchar', { length: 25, nullable: true })
  @Matches(/^[a-zA-Zа-яА-ЯЇЁіІё]*$/)
  @IsOptional()
  surname?: string;

  @Column('varchar', { length: 100, nullable: true })
  @IsOptional()
  email?: string;

  @Column('varchar', { length: 12, nullable: true })
  @Matches(/^([+]?[\\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\\s]?[0-9])*$/)
  @IsOptional()
  phone?: string;

  @Column('int', { nullable: true })
  @Max(90)
  @IsPositive()
  @IsOptional()
  age?: number;

  @Column('varchar', { length: 255, nullable: true })
  @Matches(/FS|QACX|JCX|JSCX|FE|PCX|^$/)
  @IsOptional()
  course?: string;

  @Column('varchar', { length: 255, nullable: true })
  @Matches(/static|online|^$/)
  @IsOptional()
  course_format?: string;

  @Column('varchar', { length: 255, nullable: true })
  @Matches(/pro|minimal|premium|incubator|vip|^$/)
  @IsOptional()
  course_type?: string;

  @Column('int', { nullable: true })
  @Max(2147483647)
  @IsPositive()
  @IsOptional()
  sum?: number;

  @Column('int', { nullable: true, name: 'alreadyPaid' })
  @Max(2147483647)
  @IsPositive()
  @IsOptional()
  alreadyPaid?: number;

  @Column('varchar', { length: 255, nullable: true })
  @IsOptional()
  msg?: string;

  @Column('varchar', { length: 255, nullable: true })
  @Matches(/In work|New|Agree|Disagree|Dubbing|^$/)
  @IsOptional()
  status?: string;

  @Column('int', { nullable: true, name: 'group_id' })
  @IsOptional()
  groupId?: number;

  @ManyToOne(() => GroupEntity, (group) => group.orders, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group?: GroupEntity;

  @Column('int', { nullable: true, name: 'user_id' })
  @IsOptional()
  userId?: UserID;

  @ManyToOne(() => UserEntity, (user) => user.orders, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  manager?: UserEntity;

  @Column('varchar', { length: 255, nullable: true })
  @IsOptional()
  utm?: string;

  @CreateDateColumn({ type: 'datetime', precision: 6, nullable: true })
  created_at: Date;

  @OneToMany(() => CommentEntity, (comment) => comment.order, { cascade: true })
  @JoinColumn({ name: 'comment_id' })
  comments?: CommentEntity[];
}
