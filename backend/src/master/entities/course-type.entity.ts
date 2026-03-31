import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('course_types')
export class CourseType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., UG, PG
}
