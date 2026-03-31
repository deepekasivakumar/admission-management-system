import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatMatrix } from './seat-matrix.entity';
import { SeatMatrixService } from './seat-matrix.service';
import { SeatMatrixController } from './seat-matrix.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SeatMatrix])],
  providers: [SeatMatrixService],
  controllers: [SeatMatrixController],
  exports: [SeatMatrixService],
})
export class SeatMatrixModule {}
