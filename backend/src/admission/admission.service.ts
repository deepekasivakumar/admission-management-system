import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Applicant } from './applicant.entity';
import { Admission } from './admission.entity';
import { SeatMatrixService } from '../seat-matrix/seat-matrix.service';

@Injectable()
export class AdmissionService {
  constructor(
    @InjectRepository(Applicant) private applicantRepo: Repository<Applicant>,
    @InjectRepository(Admission) private admissionRepo: Repository<Admission>,
    private seatMatrixService: SeatMatrixService,
    private dataSource: DataSource,
  ) {}

  async findAllApplicants() {
    return this.applicantRepo.find({ relations: ['appliedProgram'] });
  }

  async findAllAdmissions() {
    return this.admissionRepo.find({ 
      relations: ['applicant', 'seatMatrix', 'seatMatrix.program'] 
    });
  }

  async createApplicant(data: any) {
    return this.applicantRepo.save(data);
  }

  async allocateSeat(applicantId: number, programId: number, quotaType: string, allotmentNumber?: string) {
    const applicant = await this.applicantRepo.findOne({ where: { id: applicantId } });
    if (!applicant) throw new BadRequestException('Applicant not found');

    const matrix = await this.seatMatrixService.checkAvailability(programId, quotaType);
    
    const admission = this.admissionRepo.create({
      applicant,
      seatMatrix: matrix,
      allotmentNumber,
      feeStatus: 'Pending',
    });

    await this.seatMatrixService.lockSeat(matrix.id);
    return this.admissionRepo.save(admission);
  }

  async confirmAdmission(admissionId: number) {
    const admission = await this.admissionRepo.findOne({ 
      where: { id: admissionId },
      relations: ['applicant', 'seatMatrix', 'seatMatrix.program', 'seatMatrix.program.department'] 
    });
    if (!admission) throw new BadRequestException('Admission record not found');
    if (admission.feeStatus !== 'Paid') throw new BadRequestException('Fee must be paid before confirmation');
    if (admission.admissionNumber) throw new BadRequestException('Admission already confirmed');

    // Generate Admission Number: INST/YEAR/UG/CSE/QUOTA/SEQ
    const year = new Date().getFullYear();
    const dept = admission.seatMatrix.program.department.name.substring(0, 3).toUpperCase();
    const quota = admission.seatMatrix.quotaType.substring(0, 3).toUpperCase();
    const seq = (admission.id).toString().padStart(4, '0');
    
    admission.admissionNumber = `INST/${year}/UG/${dept}/${quota}/${seq}`;
    
    await this.seatMatrixService.confirmSeat(admission.seatMatrix.id);
    return this.admissionRepo.save(admission);
  }

  async updateFeeStatus(admissionId: number, status: string) {
    await this.admissionRepo.update(admissionId, { feeStatus: status });
    return this.admissionRepo.findOne({ where: { id: admissionId } });
  }

  async getDashboard() {
    const seatStats = await this.dataSource.getRepository('seat_matrices')
      .createQueryBuilder('sm')
      .leftJoinAndSelect('sm.program', 'program')
      .getMany();

    const pendingDocs = await this.applicantRepo.count({ where: { documentStatus: 'Pending' } });
    const pendingFees = await this.admissionRepo.count({ where: { feeStatus: 'Pending' } });

    return {
      seatStats,
      pendingDocs,
      pendingFees,
    };
  }
}
