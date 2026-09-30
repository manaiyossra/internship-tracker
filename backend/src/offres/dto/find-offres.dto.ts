import { IsOptional, IsIn, IsString, IsNumberString } from 'class-validator';

export class FindOffresDto {
  @IsOptional()
  @IsIn(['presentiel', 'hybride', 'distanciel'])
  type?: string;

  @IsOptional()
  @IsIn(['1', '2', '6'])
  duree?: string;

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}