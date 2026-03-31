import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Program } from '../master/entities/program.entity';

@Entity('applicants')
export class Applicant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  category: string; // GM, SC, ST, etc.

  @Column()
  entryType: string; // Regular, Lateral

  @Column()
  quotaType: string; // KCET, COMEDK, Management

  @Column({ default: 'Pending' })
  documentStatus: string; // Pending, Submitted, Verified

  @ManyToOne(() => Program)
  appliedProgram: Program;
}
