import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateCandidatureDto {
  @IsMongoId()
  offre: string;

  @IsOptional()
  @IsString()
  notes?: string;
}