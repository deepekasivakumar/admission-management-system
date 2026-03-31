import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MasterService } from './master.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('master')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MasterController {
  constructor(private masterService: MasterService) {}

  @Get('institutions')
  findAllInstitutions() { return this.masterService.findAllInstitutions(); }

  @Roles(Role.ADMIN)
  @Post('institutions')
  createInstitution(@Body() data) { return this.masterService.createInstitution(data); }

  @Get('campuses')
  findAllCampuses() { return this.masterService.findAllCampuses(); }

  @Roles(Role.ADMIN)
  @Post('campuses')
  createCampus(@Body() data) { return this.masterService.createCampus(data); }

  @Get('departments')
  findAllDepartments() { return this.masterService.findAllDepartments(); }

  @Roles(Role.ADMIN)
  @Post('departments')
  createDepartment(@Body() data) { return this.masterService.createDepartment(data); }

  @Get('programs')
  findAllPrograms() { return this.masterService.findAllPrograms(); }

  @Roles(Role.ADMIN)
  @Post('programs')
  createProgram(@Body() data) { return this.masterService.createProgram(data); }

  @Get('years')
  findAllYears() { return this.masterService.findAllYears(); }

  @Roles(Role.ADMIN)
  @Post('years')
  createYear(@Body() data) { return this.masterService.createYear(data); }
}
