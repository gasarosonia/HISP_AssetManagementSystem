import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssetsAssignmentsService } from './assets-assignments.service';
import { CreateAssetsAssignmentDto } from './dto/create-assets-assignment.dto';
import { UpdateAssetsAssignmentDto } from './dto/update-assets-assignment.dto';

@Controller('assets-assignments')
export class AssetsAssignmentsController {
  constructor(private readonly assetsAssignmentsService: AssetsAssignmentsService) {}

  @Post()
  create(@Body() createAssetsAssignmentDto: CreateAssetsAssignmentDto) {
    return this.assetsAssignmentsService.create(createAssetsAssignmentDto);
  }

  @Get()
  findAll() {
    return this.assetsAssignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsAssignmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssetsAssignmentDto: UpdateAssetsAssignmentDto) {
    return this.assetsAssignmentsService.update(+id, updateAssetsAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetsAssignmentsService.remove(+id);
  }
}
