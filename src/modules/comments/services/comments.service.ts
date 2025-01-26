import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IUserData } from '../../auth/interfaces/user-data.interface';
import { OrderMapper } from '../../orders/order.mapper';
import { CommentRepository } from '../../repository/services/comment.repository';
import { OrderRepository } from '../../repository/services/order.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { CommentReqDto } from '../dto/req/comment.req.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createComment(
    orderId: number,
    dto: CommentReqDto,
    userData: IUserData,
  ) {
    if (!(orderId && orderId > 0)) {
      throw new BadRequestException('Enter valid order id');
    }

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['comments'],
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
      const newComment = this.commentRepository.create({
        comment: dto.comment,
        order_id: orderId,
        user_id: userData.userId,
      });
      const savedComment = await this.commentRepository.save(newComment);
      order.userId = userData.userId;
      order.manager = user;
      order.comments.unshift(savedComment);
      if (order.status === 'New' || order.status === null) {
        order.status = 'In work';
      }
      await this.orderRepository.save(order);

      return OrderMapper.mapToCommentResDto(savedComment);
    } else throw new ForbiddenException('You cannot do it');
  }

  async getComments(orderId: number) {
    if (!(orderId && orderId > 0)) {
      throw new BadRequestException('Enter valid order id');
    }

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['comments'],
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

    return order.comments.map((comment) =>
      OrderMapper.mapToCommentResDto(comment),
    );
  }
}
