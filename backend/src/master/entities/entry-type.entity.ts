import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('entry_types')
export class EntryType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., Regular, Lateral
}
