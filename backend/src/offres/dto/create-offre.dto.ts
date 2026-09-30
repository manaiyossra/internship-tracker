import { IsString, IsIn, IsNotEmpty } from 'class-validator';

export class CreateOffreDto {
  @IsString()
  @IsNotEmpty()
  entreprise: string;

  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsIn(['presentiel', 'hybride', 'distanciel'])
  type: string;

  @IsIn([1, 2, 6])
  duree: number;

  @IsString()
  @IsNotEmpty()
  ville: string;
}