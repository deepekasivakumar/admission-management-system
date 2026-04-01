import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Institution } from './institution.entity';
import { Department } from './department.entity';

@Entity('campuses')
export class Campus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @ManyToOne(() => Institution, (institution) => institution.campuses)
  institution: Institution;

  @OneToMany(() => Department, (dept) => dept.campus)
  departments: Department[];
}
