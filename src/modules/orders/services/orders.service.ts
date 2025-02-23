import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

import { IUserData } from '../../auth/interfaces/user-data.interface';
import { GroupRepository } from '../../repository/services/group.repository';
import { OrderRepository } from '../../repository/services/order.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { BaseOrderDto } from '../dto/req/base-order.dto';
import { EditOrderDto } from '../dto/req/edit-order.dto';
import { OrderQueryDto } from '../dto/req/order-query.dto';
import { OrderPaginatedList } from '../dto/res/order-paginated.res.dto';
import { OrderMapper } from '../order.mapper';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

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

  async updateOrder(
    orderId: number,
    editOrder: EditOrderDto,
    userData: IUserData,
  ) {
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
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const isOwner = userData.userId === order.userId;
    const isManagerNotAssigned = order.userId === null;

    if (isOwner || isManagerNotAssigned) {
      if (editOrder.name != null && editOrder.name !== '') {
        order.name = editOrder.name;
      }
      if (editOrder.surname != null && editOrder.surname !== '') {
        order.surname = editOrder.surname;
      }
      if (editOrder.email != null && editOrder.email !== '') {
        order.email = editOrder.email;
      }
      if (editOrder.phone != null && editOrder.phone !== '') {
        order.phone = editOrder.phone;
      }
      if (editOrder.age != null) {
        order.age = editOrder.age;
      }
      if (editOrder.course != null && editOrder.course !== '') {
        order.course = editOrder.course;
      }
      if (editOrder.course_format != null && editOrder.course_format !== '') {
        order.course_format = editOrder.course_format;
      }
      if (editOrder.course_type != null && editOrder.course_type !== '') {
        order.course_type = editOrder.course_type;
      }
      if (editOrder.alreadyPaid != null) {
        order.alreadyPaid = editOrder.alreadyPaid;
      }
      if (editOrder.sum != null) {
        order.sum = editOrder.sum;
      }
      if (editOrder.status != null && editOrder.status !== '') {
        order.status = editOrder.status;
        if (editOrder.status === 'New') {
          order.manager = null;
        } else {
          order.manager = user;
        }
      } else {
        order.manager = user;
        order.status = 'In work';
      }

      if (editOrder.group?.trim()) {
        let group = await this.groupRepository.findOneBy({
          name: editOrder.group,
        });
        if (!group) {
          group = await this.groupRepository.save(
            this.groupRepository.create({ name: editOrder.group }),
          );
        }
        order.group = group;
      }

      const savedOrder = await this.orderRepository.save(order);

      return OrderMapper.toBaseOrderDto(savedOrder);
    } else throw new ForbiddenException('You cannot do it');
  }

  async exportOrdersToExcel(
    query: OrderQueryDto,
    userData: IUserData,
    res: Response,
  ): Promise<void> {
    const { limit = 500, page = 1 } = query;

    let sortDirection: 'ASC' | 'DESC' = 'DESC';
    let sortBy: string = 'created_at';
    if (query.order) {
      sortDirection = query.order.startsWith('-') ? 'DESC' : 'ASC';
      sortBy = query.order.replace('-', '');
    }

    const [orders] = await this.orderRepository.findOrders(
      query,
      sortBy,
      sortDirection,
      page,
      limit,
      userData.userId,
    );

    if (!orders.length) {
      throw new BadRequestException('No orders found to export');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Surname', key: 'surname', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Course Format', key: 'course_format', width: 20 },
      { header: 'Course Type', key: 'course_type', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Sum', key: 'sum', width: 15 },
      { header: 'Already Paid', key: 'alreadyPaid', width: 15 },
      { header: 'Group', key: 'group', width: 20 },
      { header: 'Created At', key: 'created_at', width: 20 },
      { header: 'Manager', key: 'manager', width: 20 },
    ];

    orders.forEach((order) => {
      worksheet.addRow(OrderMapper.toExcelOrderDto(order));
    });

    const buffer = (await workbook.xlsx.writeBuffer()) as Buffer;

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="filtered_orders.xlsx"',
    );

    res.send(buffer);
  }
}
