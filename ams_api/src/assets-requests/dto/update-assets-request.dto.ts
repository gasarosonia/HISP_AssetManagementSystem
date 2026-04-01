import { IsString, IsOptional, IsUUID, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAssetRequestDto {
  @ApiPropertyOptional({
    enum: ['PENDING', 'APPROVED', 'FULFILLED', 'REJECTED'],
  })
  @IsOptional()
  @IsIn(['PENDING', 'APPROVED', 'FULFILLED', 'REJECTED'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  verified_by_finance_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ceo_remarks?: string;
}
