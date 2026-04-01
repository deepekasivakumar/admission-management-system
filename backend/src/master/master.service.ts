import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institution } from './entities/institution.entity';
import { Campus } from './entities/campus.entity';
import { Department } from './entities/department.entity';
import { Program } from './entities/program.entity';
import { AcademicYear } from './entities/academic-year.entity';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(Institution) private institutionRepo: Repository<Institution>,
    @InjectRepository(Campus) private campusRepo: Repository<Campus>,
    @InjectRepository(Department) private deptRepo: Repository<Department>,
    @InjectRepository(Program) private programRepo: Repository<Program>,
    @InjectRepository(AcademicYear) private yearRepo: Repository<AcademicYear>,
  ) {}

  // Simplified generic CRUD methods can be added here
  async findAllInstitutions() { return this.institutionRepo.find(); }
  async createInstitution(data: any) { return this.institutionRepo.save(data); }
  async updateInstitution(id: number, data: any) { return this.institutionRepo.save({ ...data, id }); }
  async removeInstitution(id: number) { return this.institutionRepo.delete(id); }

  async findAllCampuses() { return this.campusRepo.find({ relations: ['institution'] }); }
  async createCampus(data: any) { return this.campusRepo.save(data); }
  async updateCampus(id: number, data: any) { return this.campusRepo.save({ ...data, id }); }
  async removeCampus(id: number) { return this.campusRepo.delete(id); }

  async findAllDepartments() { return this.deptRepo.find({ relations: ['campus'] }); }
  async createDepartment(data: any) { return this.deptRepo.save(data); }
  async updateDepartment(id: number, data: any) { return this.deptRepo.save({ ...data, id }); }
  async removeDepartment(id: number) { return this.deptRepo.delete(id); }

  async findAllPrograms() { return this.programRepo.find({ relations: ['department'] }); }
  async createProgram(data: any) { return this.programRepo.save(data); }
  async updateProgram(id: number, data: any) { return this.programRepo.save({ ...data, id }); }
  async removeProgram(id: number) { return this.programRepo.delete(id); }

  async findAllYears() { return this.yearRepo.find(); }
  async createYear(data: any) { return this.yearRepo.save(data); }
  async updateYear(id: number, data: any) { return this.yearRepo.save({ ...data, id }); }
  async removeYear(id: number) { return this.yearRepo.delete(id); }
}
