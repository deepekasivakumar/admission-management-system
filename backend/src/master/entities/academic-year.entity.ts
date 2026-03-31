import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('academic_years')
export class AcademicYear {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., 2025-26

  @Column({ default: true })
  isActive: boolean;
}
