import { Test, TestingModule } from '@nestjs/testing';
import { AssetsAssignmentsService } from './assets-assignments.service';

describe('AssetsAssignmentsService', () => {
  let service: AssetsAssignmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetsAssignmentsService],
    }).compile();

    service = module.get<AssetsAssignmentsService>(AssetsAssignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
