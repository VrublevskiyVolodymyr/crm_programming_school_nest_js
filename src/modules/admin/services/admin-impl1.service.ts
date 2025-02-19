import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { query } from 'express';

import { UserID } from '../../../common/types/entity-ids.type';
import { SignUpReqDto } from '../../auth/dto/req/sign-up.req.dto';
import { ActionResDto } from '../../auth/dto/res/token-pair.res.dto';
import { ActionTokenTypeEnum } from '../../auth/enums/action-token-type.enum';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { PasswordService } from '../../auth/services/password.service';
import { TokenService } from '../../auth/services/token.service';
import {
  OrderStatisticsDto,
  StatusCountDto,
} from '../../orders/dto/res/order-statistic.res.dto';
import { ActionTokenRepository } from '../../repository/services/action-token.repository';
import { OrderRepository } from '../../repository/services/order.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { PaginationQueryDto } from '../../users/dto/req/pagination-query.dto';
import { AdminUserResDto } from '../../users/dto/res/admin-user.res.dto';
import { PaginationListResDto } from '../../users/dto/res/pagination-list.res.dto';
import { UserMapper } from '../../users/user.mapper';
import { AdminMapper } from '../admin.mapper';
import { AdminService } from './admin.service';

@Injectable()
export class AdminServiceImpl1 implements AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly actionTokenRepository: ActionTokenRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  public async signUpManager(dto: SignUpReqDto): Promise<AdminUserResDto> {
    await this.isEmailExistOrThrow(dto.email);
    const password = await this.passwordService.hashPassword('Pa$$word1');

    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password, is_staff: true }),
    );

    return UserMapper.toAdminResponseDTO(user);
  }

  public async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email already exists');
    }
  }

  public async findAllWithPagination(
    query: PaginationQueryDto,
  ): Promise<PaginationListResDto> {
    const { page = 1, limit = 5 } = query;

    const total = await this.userRepository.count();

    const total_pages = Math.ceil(total / limit);

    let currentPage = page;

    if (currentPage > total_pages) {
      currentPage = total_pages;
    }
    if (currentPage < 1) {
      currentPage = 1;
    }

    const [data] = await this.userRepository.findAllWithPagination(
      currentPage,
      limit,
    );

    const prev = currentPage > 1 ? currentPage - 1 : null;
    const next = currentPage < total_pages ? currentPage + 1 : null;

    return {
      total_items: total,
      total_pages,
      prev,
      next,
      data: data.map((user) => AdminMapper.toAdminResponseDTO(user)),
    };
  }

  public async requestToken(userId: UserID): Promise<ActionResDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const actionToken = await this.tokenService.generateActionTokens(
      { userId: user.id },
      ActionTokenTypeEnum.SET_PASSWORD,
    );
    await this.actionTokenRepository.save({
      type: ActionTokenTypeEnum.SET_PASSWORD,
      user_id: user.id,
      action_token: actionToken,
    });
    return { actionToken };
  }

  public async banManager(
    userId: UserID,
    userData: IUserData,
  ): Promise<AdminUserResDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const me = userData.userId === userId;
    if (me) {
      throw new BadRequestException();
    }
    this.userRepository.merge(user, { is_active: false });
    const savedUser = await this.userRepository.save(user);
    return UserMapper.toAdminResponseDTO(savedUser);
  }

  public async unbanManager(
    userId: UserID,
    userData: IUserData,
  ): Promise<AdminUserResDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const me = userData.userId === userId;
    if (me) {
      throw new BadRequestException();
    }
    this.userRepository.merge(user, { is_active: true });
    const savedUser = await this.userRepository.save(user);
    return UserMapper.toAdminResponseDTO(savedUser);
  }

  async getOrderStatistics(): Promise<OrderStatisticsDto> {
    const totalCount = await this.orderRepository.count();
    const nullStatusCount = await this.orderRepository.countByStatus(null);
    const newStatusCount = await this.orderRepository.countByStatus('New');
    const newAndNullStatusCount = newStatusCount + nullStatusCount;

    const statuses: StatusCountDto[] = [
      {
        status: 'In work',
        count: await this.orderRepository.countByStatus('In work'),
      },
      {
        status: 'Agree',
        count: await this.orderRepository.countByStatus('Agree'),
      },
      { status: 'New', count: newAndNullStatusCount },
      {
        status: 'Disagree',
        count: await this.orderRepository.countByStatus('Disagree'),
      },
      {
        status: 'Dubbing',
        count: await this.orderRepository.countByStatus('Dubbing'),
      },
    ];

    return {
      total_count: totalCount,
      statuses,
    };
  }

  async getManagerStatistics(userId: UserID): Promise<OrderStatisticsDto> {
    const manager = await this.userRepository.findOneBy({ id: userId });
    if (!manager) {
      throw new NotFoundException(`Manager with id ${userId} not found`);
    }

    const totalCount = await this.orderRepository.countByManager(manager);
    const nullStatusCount = await this.orderRepository.countByStatusAndManager(
      null,
      manager,
    );
    const newStatusCount = await this.orderRepository.countByStatusAndManager(
      'New',
      manager,
    );
    const newAndNullStatusCount = newStatusCount + nullStatusCount;

    const statuses: StatusCountDto[] = [
      {
        status: 'In work',
        count: await this.orderRepository.countByStatusAndManager(
          'In work',
          manager,
        ),
      },
      {
        status: 'Agree',
        count: await this.orderRepository.countByStatusAndManager(
          'Agree',
          manager,
        ),
      },
      {
        status: 'New',
        count: newAndNullStatusCount,
      },
      {
        status: 'Disagree',
        count: await this.orderRepository.countByStatusAndManager(
          'Disagree',
          manager,
        ),
      },
      {
        status: 'Dubbing',
        count: await this.orderRepository.countByStatusAndManager(
          'Dubbing',
          manager,
        ),
      },
    ];

    return { total_count: totalCount, statuses };
  }
}
