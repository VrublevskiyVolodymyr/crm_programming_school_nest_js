import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserID } from '../../../common/types/entity-ids.type';
import { OrderEntity } from '../../../database/entities/order.entity';
import { TableNameEnum } from '../../../database/enums/table-name.enum';
import { OrderQueryDto } from '../../orders/dto/req/order-query.dto';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(OrderEntity, dataSource.manager);
  }

  public async findOrders(
    queryParams: OrderQueryDto,
    sortBy: string,
    sortDirection: 'ASC' | 'DESC',
    page: number = 1,
    limit: number = 25,
    userId: UserID,
  ): Promise<[OrderEntity[], number]> {
    const query = this.createQueryBuilder(TableNameEnum.ORDERS);

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        switch (key) {
          case 'status':
            query.andWhere(
              `(${TableNameEnum.ORDERS}.status = :status OR (${TableNameEnum.ORDERS}.status IS NULL AND :status = 'New'))`,
              { status: value },
            );
            break;
          case 'course':
            if (value) {
              query.andWhere(`${TableNameEnum.ORDERS}.course LIKE :course`, {
                course: `%${value}%`,
              });
            }
            break;
          case 'course_format':
            if (value) {
              query.andWhere(
                `${TableNameEnum.ORDERS}.course_format LIKE :course_format`,
                { course_format: `%${value}%` },
              );
            }
            break;
          case 'course_type':
            if (value) {
              query.andWhere(
                `${TableNameEnum.ORDERS}.course_type LIKE :course_type`,
                { course_type: `%${value}%` },
              );
            }
            break;
          case 'name':
          case 'surname':
          case 'email':
          case 'phone':
            query.andWhere(`${TableNameEnum.ORDERS}.${key} LIKE :${key}`, {
              [key]: `%${value}%`,
            });
            break;
          case 'sum':
            query.andWhere(`${TableNameEnum.ORDERS}.sum = :sum`, {
              sum: value,
            });
            break;
          case 'age':
            if (value && !isNaN(value)) {
              query.andWhere(`${TableNameEnum.ORDERS}.age = :age`, {
                age: Number(value),
              });
            }
            break;
          case 'group':
            query
              .leftJoin(`${TableNameEnum.ORDERS}.group`, 'group')
              .andWhere('group.name = :group', { group: value });
            break;
          case 'startDate':
            if (value) {
              query.andWhere(
                `${TableNameEnum.ORDERS}.created_at >= :startDate`,
                { startDate: value },
              );
            }
            break;
          case 'endDate':
            if (value) {
              query.andWhere(`${TableNameEnum.ORDERS}.created_at <= :endDate`, {
                endDate: value,
              });
            }
            break;
          case 'my':
            if (value === true) {
              query.andWhere(`${TableNameEnum.ORDERS}.userId = :userId`, {
                userId,
              });
            }
            break;
          default:
            break;
        }
      }
    });
    query.leftJoinAndSelect(`${TableNameEnum.ORDERS}.manager`, 'manager');
    query.leftJoinAndSelect(`${TableNameEnum.ORDERS}.group`, 'tableGroup');
    query.leftJoinAndSelect(`${TableNameEnum.ORDERS}.comments`, 'comments');

    query.skip((page - 1) * limit).take(limit);

    query.addOrderBy(`${TableNameEnum.ORDERS}.${sortBy}`, sortDirection);

    const [orders, total] = await query.getManyAndCount();

    return [orders, total];
  }
}
