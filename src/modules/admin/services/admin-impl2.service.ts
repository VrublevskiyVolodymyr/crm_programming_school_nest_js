import { Injectable } from '@nestjs/common';

import { UserID } from '../../../common/types/entity-ids.type';
import { SignUpReqDto } from '../../auth/dto/req/sign-up.req.dto';
import { ActionResDto } from '../../auth/dto/res/token-pair.res.dto';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { PaginationQueryDto } from '../../users/dto/req/pagination-query.dto';
import { AdminUserResDto } from '../../users/dto/res/admin-user.res.dto';
import { PaginationListResDto } from '../../users/dto/res/pagination-list.res.dto';
import { AdminService } from './admin.service';

@Injectable()
export class AdminServiceImpl2 implements AdminService {
  signUpManager(dto: SignUpReqDto): Promise<AdminUserResDto> {
    return Promise.resolve(undefined);
  }

  isEmailExistOrThrow(email: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  requestToken(id: UserID): Promise<ActionResDto> {
    return Promise.resolve(undefined);
  }

  banManager(userId: UserID, userData: IUserData): Promise<AdminUserResDto> {
    return Promise.resolve(undefined);
  }

  unbanManager(userId: UserID, userData: IUserData): Promise<AdminUserResDto> {
    return Promise.resolve(undefined);
  }

  findAllWithPagination(
    query: PaginationQueryDto,
  ): Promise<PaginationListResDto> {
    return Promise.resolve(undefined);
  }
}
