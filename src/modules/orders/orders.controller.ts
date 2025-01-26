import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CommentReqDto } from '../comments/dto/req/comment.req.dto';
import { CommentResDto } from '../comments/dto/res/comment.res.dto';
import { CommentsService } from '../comments/services/comments.service';
import { BaseOrderDto } from './dto/req/base-order.dto';
import { OrderQueryDto } from './dto/req/order-query.dto';
import { OrderPaginatedList } from './dto/res/order-paginated.res.dto';
import { OrdersService } from './services/orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly commentService: CommentsService,
  ) {}

  @ApiBearerAuth()
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiOperation({
    summary: 'Fetch all orders',
    description: 'Retrieves a paginated list of orders with optional filters.',
  })
  @Get()
  async getAllOrders(
    @Query() query: OrderQueryDto,
    @CurrentUser() userData: IUserData,
  ): Promise<OrderPaginatedList> {
    return await this.ordersService.getAllOrders(query, userData);
  }

  @ApiBearerAuth()
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiOperation({
    summary: 'Fetch a specific order by ID',
    description:
      'Retrieves details of a specific order using the provided order ID.',
  })
  @Get('/:orderId')
  async getOrder(@Param('orderId') orderId: number): Promise<BaseOrderDto> {
    return await this.ordersService.getOrder(orderId);
  }

  @ApiBearerAuth()
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiOperation({
    summary: 'Create a comment by order ID',
    description:
      'Creates a comment for a specific order using the provided order ID.',
  })
  @Post('/:orderId/comments')
  async createComment(
    @Param('orderId') orderId: number,
    @Body() dto: CommentReqDto,
    @CurrentUser() userData: IUserData,
  ): Promise<CommentResDto> {
    return await this.commentService.createComment(orderId, dto, userData);
  }

  @ApiBearerAuth()
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiOperation({
    summary: 'Fetch a specific comments by order ID',
    description:
      'Retrieves details of a specific comments using the provided order ID.',
  })
  @Get('/:orderId/comments')
  async getComments(
    @Param('orderId') orderId: number,
  ): Promise<CommentResDto[]> {
    return await this.commentService.getComments(orderId);
  }
}
