import { Module } from '@nestjs/common';
import { AssetsAssignmentsService } from './assets-assignments.service';
import { AssetsAssignmentsController } from './assets-assignments.controller';

@Module({
  controllers: [AssetsAssignmentsController],
  providers: [AssetsAssignmentsService],
})
export class AssetsAssignmentsModule {}
