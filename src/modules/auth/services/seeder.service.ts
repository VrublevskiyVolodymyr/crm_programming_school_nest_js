import { Injectable } from '@nestjs/common';

import { UserRepository } from '../../repository/services/user.repository';
import { UserRoleEnum } from '../../users/enums/user-role.enum';
import { PasswordService } from './password.service';

@Injectable()
export class SeederAdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  public async seedAdmin() {
    const email = 'admin@gmail.com';
    const existingAdmin = await this.userRepository.findOneBy({ email });
    if (!existingAdmin) {
      const admin = this.userRepository.create({
        name: 'admin',
        surname: 'adminovych',
        email: email,
        password: await this.passwordService.hashPassword('admin'),
        role: UserRoleEnum.ADMIN,
        is_active: true,
        is_staff: true,
        is_superuser: true,
      });

      await this.userRepository.save(admin);
    }
  }
}
