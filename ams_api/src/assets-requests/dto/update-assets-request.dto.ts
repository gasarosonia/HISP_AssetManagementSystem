import {
  IsString,
  IsOptional,
  IsUUID,
  IsIn,
  IsEnum,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UrgencyLevel } from './create-assets-request.dto';

class UpdateRequestItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  quantity?: number;

  @IsOptional()
  unit_price?: number;
}

class UpdateFinancialsDto {
  @IsString()
  @IsOptional()
  cost_basis?: string;

  @IsOptional()
  transport_fees?: number;

  @IsOptional()
  subtotal?: number;

  @IsOptional()
  grand_total?: number;

  @IsString()
  @IsOptional()
  budget_code_1?: string;

  @IsString()
  @IsOptional()
  budget_code_2?: string;
}

class UpdateLogisticsDto {
  @IsString()
  @IsOptional()
  destination?: string;

  @IsString()
  @IsOptional()
  contact_name?: string;

  @IsString()
  @IsOptional()
  contact_email?: string;

  @IsString()
  @IsOptional()
  contact_phone?: string;
}

export class UpdateAssetRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: UrgencyLevel })
  @IsOptional()
  @IsEnum(UrgencyLevel)
  urgency?: UrgencyLevel;

  @ApiPropertyOptional({
    enum: [
      'PENDING',
      'HOD_APPROVED',
      'APPROVED',
      'CEO_REVIEW',
      'CEO_APPROVED',
      'ORDERED',
      'FULFILLED',
      'REJECTED',
    ],
  })
  @IsOptional()
  @IsIn([
    'PENDING',
    'HOD_APPROVED',
    'APPROVED',
    'CEO_REVIEW',
    'CEO_APPROVED',
    'ORDERED',
    'FULFILLED',
    'REJECTED',
  ])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  requested_by_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  department_id?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateRequestItemDto)
  items?: UpdateRequestItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateFinancialsDto)
  financials?: UpdateFinancialsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateLogisticsDto)
  logistics?: UpdateLogisticsDto;

  @IsOptional()
  @IsBoolean()
  is_shared?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  verified_by_finance_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ceo_remarks?: string;

  @IsOptional()
  @IsObject()
  purchase_order?: Record<string, any>;
}
