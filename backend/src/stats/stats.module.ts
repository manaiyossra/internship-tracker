import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Offre, OffreSchema } from '../offres/schemas/offre.schema';
import { Candidature, CandidatureSchema } from '../candidatures/schemas/candidature.schema';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Offre.name, schema: OffreSchema },
      { name: Candidature.name, schema: CandidatureSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}