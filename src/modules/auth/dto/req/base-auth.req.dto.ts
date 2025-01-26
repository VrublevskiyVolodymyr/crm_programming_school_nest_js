import { PickType } from '@nestjs/swagger';

import { CreateUserDto } from '../../../users/dto/req/create-user.dto';

export class BaseAuthReqDto extends PickType(CreateUserDto, [
  'email',
  'password',
  'name',
  'surname',
  'role',
]) {}
