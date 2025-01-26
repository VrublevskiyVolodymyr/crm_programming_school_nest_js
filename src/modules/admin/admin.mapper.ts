import { UserEntity } from '../../database/entities/user.entity';
import { IJwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { AdminUserResDto } from './dto/res/admin-user.dto';
import { PrivateUserResDto } from './dto/res/privat-user.res.dto';

export class UserMapper {
  public static toResponseDTO(data: UserEntity): PrivateUserResDto {
    return {
      id: data.id,
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone ? data.phone : null,
    };
  }

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
      phone: data.phone ? data.phone : null,
      is_active: data.is_active,
      last_login: data.last_login,
      is_superuser: data.is_superuser,
    };
  }
}
