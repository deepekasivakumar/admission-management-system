import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Campus } from './campus.entity';
import { Program } from './program.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @ManyToOne(() => Campus, (campus) => campus.departments)
  campus: Campus;

  @OneToMany(() => Program, (program) => program.department)
  programs: Program[];
}
