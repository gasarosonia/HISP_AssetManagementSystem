import { PartialType } from '@nestjs/swagger';
import { CreateAssetsAssignmentDto } from './create-assets-assignment.dto';

export class UpdateAssetsAssignmentDto extends PartialType(CreateAssetsAssignmentDto) {}
