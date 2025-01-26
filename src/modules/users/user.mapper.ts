import { ConfigStaticService } from '../../config/config-static';
import { UserEntity } from '../../database/entities/user.entity';
import { IJwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { PrivateUserResDto } from './dto/res/privat-user.res.dto';
import { AdminUserResDto } from './dto/res/admin-user.dto';

export class UserMapper {
  public static toResponseDTO(data: UserEntity): PrivateUserResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ? data.phone : null,
      image: data.image ? `${awsConfig.bucketUrl}/${data.image}` : null,
    };
  }

  public static toIUserData(user: UserEntity, payload: IJwtPayload): IUserData {
    return {
      userId: payload.userId,
      deviceId: payload.deviceId,
      email: user.email,
      roles: user.roles,
    };
  }

  public static toAdminResponseDTO(data: UserEntity): AdminUserResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ? data.phone : null,
      image: data.image ? `${awsConfig.bucketUrl}/${data.image}` : null,
      is_active: data.is_active,
      is_verified: data.is_verified,
      accountType: data.accountType,
    };
  }
}
