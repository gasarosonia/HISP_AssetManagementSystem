import { Test, TestingModule } from '@nestjs/testing';
import { AssetsRequestsController } from './assets-requests.controller';
import { AssetsRequestsService } from './assets-requests.service';

describe('AssetsRequestsController', () => {
  let controller: AssetsRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsRequestsController],
      providers: [AssetsRequestsService],
    }).compile();

    controller = module.get<AssetsRequestsController>(AssetsRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
