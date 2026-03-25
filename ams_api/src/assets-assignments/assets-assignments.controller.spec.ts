import { Test, TestingModule } from '@nestjs/testing';
import { AssetsAssignmentsController } from './assets-assignments.controller';
import { AssetsAssignmentsService } from './assets-assignments.service';

describe('AssetsAssignmentsController', () => {
  let controller: AssetsAssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsAssignmentsController],
      providers: [AssetsAssignmentsService],
    }).compile();

    controller = module.get<AssetsAssignmentsController>(AssetsAssignmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
