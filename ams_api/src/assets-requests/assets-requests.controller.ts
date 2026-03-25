import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssetsRequestsService } from './assets-requests.service';
import { CreateAssetsRequestDto } from './dto/create-assets-request.dto';
import { UpdateAssetsRequestDto } from './dto/update-assets-request.dto';

@Controller('assets-requests')
export class AssetsRequestsController {
  constructor(private readonly assetsRequestsService: AssetsRequestsService) {}

  @Post()
  create(@Body() createAssetsRequestDto: CreateAssetsRequestDto) {
    return this.assetsRequestsService.create(createAssetsRequestDto);
  }

  @Get()
  findAll() {
    return this.assetsRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsRequestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssetsRequestDto: UpdateAssetsRequestDto) {
    return this.assetsRequestsService.update(+id, updateAssetsRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetsRequestsService.remove(+id);
  }
}
