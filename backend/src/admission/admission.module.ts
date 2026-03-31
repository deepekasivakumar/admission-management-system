import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from './applicant.entity';
import { Admission } from './admission.entity';
import { AdmissionService } from './admission.service';
import { AdmissionController } from './admission.controller';
import { SeatMatrixModule } from '../seat-matrix/seat-matrix.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Applicant, Admission]),
    SeatMatrixModule,
  ],
  providers: [AdmissionService],
  controllers: [AdmissionController],
  exports: [AdmissionService],
})
export class AdmissionModule {}
