import { Injectable } from '@nestjs/common';
import { CreateAssetsRequestDto } from './dto/create-assets-request.dto';
import { UpdateAssetsRequestDto } from './dto/update-assets-request.dto';

@Injectable()
export class AssetsRequestsService {
  create(createAssetsRequestDto: CreateAssetsRequestDto) {
    return 'This action adds a new assetsRequest';
  }

  findAll() {
    return `This action returns all assetsRequests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assetsRequest`;
  }

  update(id: number, updateAssetsRequestDto: UpdateAssetsRequestDto) {
    return `This action updates a #${id} assetsRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} assetsRequest`;
  }
}
