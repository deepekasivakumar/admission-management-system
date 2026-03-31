import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('admission')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdmissionController {
  constructor(private admissionService: AdmissionService) {}

  @Roles(Role.ADMISSION_OFFICER, Role.ADMIN, Role.MANAGEMENT)
  @Get('applicants')
  findAllApplicants() { return this.admissionService.findAllApplicants(); }

  @Roles(Role.ADMISSION_OFFICER, Role.ADMIN, Role.MANAGEMENT)
  @Get('all')
  findAllAdmissions() { return this.admissionService.findAllAdmissions(); }

  @Roles(Role.ADMISSION_OFFICER, Role.ADMIN)
  @Post('applicant')
  createApplicant(@Body() data) { return this.admissionService.createApplicant(data); }

  @Roles(Role.ADMISSION_OFFICER, Role.ADMIN)
  @Post('allocate')
  allocateSeat(@Body() data) { 
    return this.admissionService.allocateSeat(data.applicantId, data.programId, data.quotaType, data.allotmentNumber); 
  }

  @Roles(Role.ADMISSION_OFFICER, Role.ADMIN)
  @Post('confirm/:id')
  confirmAdmission(@Param('id') id: number) { return this.admissionService.confirmAdmission(id); }

  @Roles(Role.ADMISSION_OFFICER, Role.ADMIN)
  @Patch('fee/:id')
  updateFee(@Param('id') id: number, @Body('status') status: string) { 
    return this.admissionService.updateFeeStatus(id, status); 
  }

  @Roles(Role.ADMIN, Role.ADMISSION_OFFICER, Role.MANAGEMENT)
  @Get('dashboard')
  getDashboard() { return this.admissionService.getDashboard(); }
}
