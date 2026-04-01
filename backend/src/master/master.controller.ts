import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
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

  @Roles(Role.ADMIN)
  @Put('institutions/:id')
  updateInstitution(@Param('id') id: string, @Body() data) { return this.masterService.updateInstitution(+id, data); }

  @Roles(Role.ADMIN)
  @Delete('institutions/:id')
  removeInstitution(@Param('id') id: string) { return this.masterService.removeInstitution(+id); }

  @Get('campuses')
  findAllCampuses() { return this.masterService.findAllCampuses(); }

  @Roles(Role.ADMIN)
  @Post('campuses')
  createCampus(@Body() data) { return this.masterService.createCampus(data); }

  @Roles(Role.ADMIN)
  @Put('campuses/:id')
  updateCampus(@Param('id') id: string, @Body() data) { return this.masterService.updateCampus(+id, data); }

  @Roles(Role.ADMIN)
  @Delete('campuses/:id')
  removeCampus(@Param('id') id: string) { return this.masterService.removeCampus(+id); }

  @Get('departments')
  findAllDepartments() { return this.masterService.findAllDepartments(); }

  @Roles(Role.ADMIN)
  @Post('departments')
  createDepartment(@Body() data) { return this.masterService.createDepartment(data); }

  @Roles(Role.ADMIN)
  @Put('departments/:id')
  updateDepartment(@Param('id') id: string, @Body() data) { return this.masterService.updateDepartment(+id, data); }

  @Roles(Role.ADMIN)
  @Delete('departments/:id')
  removeDepartment(@Param('id') id: string) { return this.masterService.removeDepartment(+id); }

  @Get('programs')
  findAllPrograms() { return this.masterService.findAllPrograms(); }

  @Roles(Role.ADMIN)
  @Post('programs')
  createProgram(@Body() data) { return this.masterService.createProgram(data); }

  @Roles(Role.ADMIN)
  @Put('programs/:id')
  updateProgram(@Param('id') id: string, @Body() data) { return this.masterService.updateProgram(+id, data); }

  @Roles(Role.ADMIN)
  @Delete('programs/:id')
  removeProgram(@Param('id') id: string) { return this.masterService.removeProgram(+id); }

  @Get('years')
  findAllYears() { return this.masterService.findAllYears(); }

  @Roles(Role.ADMIN)
  @Post('years')
  createYear(@Body() data) { return this.masterService.createYear(data); }

  @Roles(Role.ADMIN)
  @Put('years/:id')
  updateYear(@Param('id') id: string, @Body() data) { return this.masterService.updateYear(+id, data); }

  @Roles(Role.ADMIN)
  @Delete('years/:id')
  removeYear(@Param('id') id: string) { return this.masterService.removeYear(+id); }
}
