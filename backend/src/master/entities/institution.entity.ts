import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Campus } from './campus.entity';

@Entity('institutions')
export class Institution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @OneToMany(() => Campus, (campus) => campus.institution)
  campuses: Campus[];
}
