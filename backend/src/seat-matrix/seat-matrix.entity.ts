import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Program } from '../master/entities/program.entity';

@Entity('seat_matrices')
@Unique(['program', 'quotaType'])
export class SeatMatrix {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Program)
  program: Program;

  @Column()
  quotaType: string; // KCET, COMEDK, Management

  @Column({ default: 0 })
  intake: number;

  @Column({ default: 0 })
  admitted: number;
  
  @Column({ default: 0 })
  locked: number; // Seats locked but not yet confirmed
}
