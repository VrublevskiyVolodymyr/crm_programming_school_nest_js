import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { CreateUserDto } from '../../../users/dto/req/create-user.dto';

export class BaseAuthReqDto extends PickType(CreateUserDto, [
  'email',
  'password',
  'firstName',
  'lastName',
  'phone',
  'role',
]) {
  @IsNotEmpty()
  @IsString()
  readonly deviceId: string;
}
