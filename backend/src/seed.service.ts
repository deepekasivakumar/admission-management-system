import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from './user/user.service';
import { Role } from './common/enums/role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private userService: UserService) {}

  async onModuleInit() {
    const admin = await this.userService.findOne('admin');
    if (!admin) {
      console.log('Seeding admin user...');
      await this.userService.create({
        username: 'admin',
        password: 'admin123',
        role: Role.ADMIN,
      });
      console.log('Admin user created: admin / admin123');
    }
    
    const officer = await this.userService.findOne('officer');
    if (!officer) {
      await this.userService.create({
        username: 'officer',
        password: 'officer123',
        role: Role.ADMISSION_OFFICER,
      });
      console.log('Officer user created: officer / officer123');
    }
  }
}
