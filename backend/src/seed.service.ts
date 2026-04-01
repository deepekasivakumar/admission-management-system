import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from './user/user.service';
import { Role } from './common/enums/role.enum';
import { User } from './user/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private userService: UserService) {}

  async onModuleInit() {
    let admin = await this.userService.findOne('admin@gmail.com');
    if (!admin) {
      console.log('Seeding admin user...');
      admin = new User();
      admin.username = 'admin@gmail.com';
      admin.password = 'admin123';
      admin.role = Role.ADMIN;
      await this.userService.createPlain(admin);
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists, ensuring password is correct...');
      admin.password = 'admin123';
      await this.userService.createPlain(admin);
    }
    
    let officer = await this.userService.findOne('officer');
    if (!officer) {
      officer = new User();
      officer.username = 'officer';
      officer.password = 'officer123';
      officer.role = Role.ADMISSION_OFFICER;
      await this.userService.createPlain(officer);
      console.log('Officer user created');
    } else {
      officer.password = 'officer123';
      officer.role = Role.ADMISSION_OFFICER;
      await this.userService.createPlain(officer);
    }

    let management = await this.userService.findOne('management@example.com');
    if (!management) {
      console.log('Seeding management user...');
      management = new User();
      management.username = 'management@example.com';
      management.password = 'mgmt123';
      management.role = Role.MANAGEMENT;
      await this.userService.createPlain(management);
      console.log('Management user created');
    } else {
      management.password = 'mgmt123';
      management.role = Role.MANAGEMENT;
      await this.userService.createPlain(management);
    }
  }
}
