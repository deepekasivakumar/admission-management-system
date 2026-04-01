import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    console.log(`Login attempt: ${username}`);
    const user = await this.userService.findOne(username);
    
    if (!user) {
      console.log(`User not found: ${username}`);
      // Temporary bypass for development
      if (username === 'mail2deepeka@gmail.com' && pass === 'mail@123') {
        console.log('Bypassing authentication for default user');
        return { username, role: 'ADMIN', id: 999 };
      }
      return null;
    }

    console.log('User found, checking password...');
    if (user.password) {
      const isMatch = await bcrypt.compare(pass, user.password).catch(() => false);
      console.log(`Bcrypt match: ${isMatch}, Plain match: ${pass === user.password}`);
      if (isMatch || pass === user.password) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
          id: user.id,
          username: user.username,
          role: user.role
      }
    };
  }
}
