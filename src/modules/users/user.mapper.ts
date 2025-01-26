import { UserEntity } from '../../database/entities/user.entity';
import { IJwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { AdminUserResDto } from './dto/res/admin-user.res.dto';

export class UserMapper {
  public static toIUserData(user: UserEntity, payload: IJwtPayload): IUserData {
    return {
      userId: payload.userId,
      email: user.email,
      role: user.role,
    };
  }

  public static toAdminResponseDTO(data: UserEntity): AdminUserResDto {
    return {
      id: data.id,
      name: data.name,
      surname: data.surname,
      email: data.email,
      is_active: data.is_active,
      last_login: data.last_login,
      is_staff: data.is_staff,
      is_superuser: data.is_superuser,
    };
  }
}
