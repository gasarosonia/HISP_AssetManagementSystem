import { Test, TestingModule } from '@nestjs/testing';
import { AssetsRequestsService } from './assets-requests.service';

describe('AssetsRequestsService', () => {
  let service: AssetsRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetsRequestsService],
    }).compile();

    service = module.get<AssetsRequestsService>(AssetsRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
