import { Injectable } from '@nestjs/common';
import { CreateAssetsAssignmentDto } from './dto/create-assets-assignment.dto';
import { UpdateAssetsAssignmentDto } from './dto/update-assets-assignment.dto';

@Injectable()
export class AssetsAssignmentsService {
  create(createAssetsAssignmentDto: CreateAssetsAssignmentDto) {
    return 'This action adds a new assetsAssignment';
  }

  findAll() {
    return `This action returns all assetsAssignments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assetsAssignment`;
  }

  update(id: number, updateAssetsAssignmentDto: UpdateAssetsAssignmentDto) {
    return `This action updates a #${id} assetsAssignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} assetsAssignment`;
  }
}
