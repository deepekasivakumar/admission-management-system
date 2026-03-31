import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SeatMatrixService } from './seat-matrix.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('seat-matrix')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SeatMatrixController {
  constructor(private seatMatrixService: SeatMatrixService) {}

  @Get()
  findAll() { return this.seatMatrixService.findAll(); }

  @Roles(Role.ADMIN)
  @Post()
  setMatrix(@Body() data) { return this.seatMatrixService.setMatrix(data); }
}
