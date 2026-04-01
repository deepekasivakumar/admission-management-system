import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body) {
    console.log('Controller: Received login request', body);
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      console.log('Controller: Login failed');
      throw new UnauthorizedException();
    }
    console.log('Controller: Login successful');
    return this.authService.login(user);
  }
}

import { UnauthorizedException } from '@nestjs/common';
