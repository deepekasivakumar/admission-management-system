import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admission_modes')
export class AdmissionMode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., Government, Management
}
