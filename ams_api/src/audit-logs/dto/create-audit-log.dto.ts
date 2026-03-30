import { IsString, IsUUID, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateAuditLogDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  table_name: string;

  @IsUUID()
  @IsNotEmpty()
  record_id: string;

  @IsOptional()
  old_values?: Record<string, unknown>;

  @IsOptional()
  new_values?: Record<string, unknown>;
}
