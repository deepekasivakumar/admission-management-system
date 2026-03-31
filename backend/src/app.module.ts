import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MasterModule } from './master/master.module';
import { SeatMatrixModule } from './seat-matrix/seat-matrix.module';
import { User } from './user/user.entity';
import { Institution } from './master/entities/institution.entity';
import { Campus } from './master/entities/campus.entity';
import { Department } from './master/entities/department.entity';
import { Program } from './master/entities/program.entity';
import { AcademicYear } from './master/entities/academic-year.entity';
import { CourseType } from './master/entities/course-type.entity';
import { EntryType } from './master/entities/entry-type.entity';
import { AdmissionMode } from './master/entities/admission-mode.entity';
import { SeatMatrix } from './seat-matrix/seat-matrix.entity';
import { AdmissionModule } from './admission/admission.module';
import { Applicant } from './admission/applicant.entity';
import { Admission } from './admission/admission.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    MasterModule,
    SeatMatrixModule,
    AdmissionModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          User, Institution, Campus, Department, Program,
          AcademicYear, CourseType, EntryType, AdmissionMode, SeatMatrix,
          Applicant, Admission
        ],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
