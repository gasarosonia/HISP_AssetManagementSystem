import { Module } from '@nestjs/common';
import { AssetsRequestsService } from './assets-requests.service';
import { AssetsRequestsController } from './assets-requests.controller';

@Module({
  controllers: [AssetsRequestsController],
  providers: [AssetsRequestsService],
})
export class AssetsRequestsModule {}
