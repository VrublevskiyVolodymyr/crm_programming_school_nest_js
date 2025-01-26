import { UserID } from '../../../common/types/entity-ids.type';
import { SignUpReqDto } from '../../auth/dto/req/sign-up.req.dto';
import { ActionResDto } from '../../auth/dto/res/token-pair.res.dto';
import { PaginationQueryDto } from '../../users/dto/req/pagination-query.dto';
import { AdminUserResDto } from '../../users/dto/res/admin-user.res.dto';
import { PaginationListResDto } from '../../users/dto/res/pagination-list.res.dto';

export interface AdminService {
  signUpManager(dto: SignUpReqDto): Promise<AdminUserResDto>;

  isEmailExistOrThrow(email: string): Promise<void>;

  findAllWithPagination(
    query: PaginationQueryDto,
  ): Promise<PaginationListResDto>;

  requestToken(id: UserID): Promise<ActionResDto>;

  banManager(userId: UserID): Promise<AdminUserResDto>;

  unbanManager(userId: UserID): Promise<AdminUserResDto>;
}
