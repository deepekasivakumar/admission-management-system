import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeatMatrix } from './seat-matrix.entity';

@Injectable()
export class SeatMatrixService {
  constructor(
    @InjectRepository(SeatMatrix)
    private seatMatrixRepo: Repository<SeatMatrix>,
  ) {}

  async findAll() {
    return this.seatMatrixRepo.find({ relations: ['program', 'program.department'] });
  }

  async checkAvailability(programId: number, quotaType: string): Promise<SeatMatrix> {
    const matrix = await this.seatMatrixRepo.findOne({
      where: { program: { id: programId }, quotaType },
    });
    if (!matrix) {
      throw new BadRequestException('Seat matrix not configured for this program/quota');
    }
    if (matrix.admitted + matrix.locked >= matrix.intake) {
      throw new BadRequestException(`No seats available in ${quotaType} quota for this program`);
    }
    return matrix;
  }

  async setMatrix(data: any) {
    return this.seatMatrixRepo.save(data);
  }

  async lockSeat(id: number) {
    await this.seatMatrixRepo.increment({ id }, 'locked', 1);
  }

  async confirmSeat(id: number) {
    await this.seatMatrixRepo.decrement({ id }, 'locked', 1);
    await this.seatMatrixRepo.increment({ id }, 'admitted', 1);
  }
}
