import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Applicant } from './applicant.entity';
import { SeatMatrix } from '../seat-matrix/seat-matrix.entity';

@Entity('admissions')
export class Admission {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Applicant)
  @JoinColumn()
  applicant: Applicant;

  @ManyToOne(() => SeatMatrix)
  seatMatrix: SeatMatrix;

  @Column({ nullable: true })
  allotmentNumber: string;

  @Column({ unique: true, nullable: true })
  admissionNumber: string;

  @Column({ default: 'Pending' })
  feeStatus: string; // Pending, Paid

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  admissionDate: Date;
}
