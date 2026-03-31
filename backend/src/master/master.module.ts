import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from './entities/institution.entity';
import { Campus } from './entities/campus.entity';
import { Department } from './entities/department.entity';
import { Program } from './entities/program.entity';
import { AcademicYear } from './entities/academic-year.entity';
import { CourseType } from './entities/course-type.entity';
import { EntryType } from './entities/entry-type.entity';
import { AdmissionMode } from './entities/admission-mode.entity';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Institution, Campus, Department, Program, 
      AcademicYear, CourseType, EntryType, AdmissionMode
    ]),
  ],
  providers: [MasterService],
  controllers: [MasterController],
  exports: [MasterService],
})
export class MasterModule {}
