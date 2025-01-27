import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IUserData } from '../../auth/interfaces/user-data.interface';
import { OrderRepository } from '../../repository/services/order.repository';
import { BaseOrderDto } from '../dto/req/base-order.dto';
import { OrderQueryDto } from '../dto/req/order-query.dto';
import { OrderPaginatedList } from '../dto/res/order-paginated.res.dto';
import { OrderMapper } from '../order.mapper';

@Injectable()
export class OrdersService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getAllOrders(
    query: OrderQueryDto,
    userData: IUserData,
  ): Promise<OrderPaginatedList> {
    const { limit = 25, page = 1 } = query;

    let sortDirection: 'ASC' | 'DESC' = 'DESC';
    let sortBy: string = 'created_at';
    if (query.order) {
      sortDirection = query.order.startsWith('-') ? 'DESC' : 'ASC';
      sortBy = query.order.replace('-', '');
    }

    const [orders, totalRecords] = await this.orderRepository.findOrders(
      query,
      sortBy,
      sortDirection,
      page,
      limit,
      userData.userId,
    );

    orders.forEach((order) => {
      if (order.comments && Array.isArray(order.comments)) {
        order.comments.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      }
    });

    const maxPage = Math.ceil(totalRecords / limit);
    const prev = page > 1 ? page - 1 : null;
    const next = page < maxPage ? page + 1 : null;

    return {
      total_items: totalRecords,
      total_pages: maxPage,
      prev,
      next,
      items: orders.map((order) => OrderMapper.toBaseOrderDto(order)),
    };
  }

  async getOrder(orderId: number): Promise<BaseOrderDto> {
    if (!(orderId && orderId > 0)) {
      throw new BadRequestException('Enter valid order id');
    }

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['group', 'manager', 'comments'],
      order: {
        comments: {
          created_at: 'DESC',
        },
      },
    });

    if (!order) {
      throw new NotFoundException(
        `Order with id ${orderId} not found in data base`,
      );
    }

    return OrderMapper.toBaseOrderDto(order);
  }
}
