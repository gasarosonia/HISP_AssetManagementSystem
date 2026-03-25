import { PartialType } from '@nestjs/swagger';
import { CreateAssetsRequestDto } from './create-assets-request.dto';

export class UpdateAssetsRequestDto extends PartialType(CreateAssetsRequestDto) {}
