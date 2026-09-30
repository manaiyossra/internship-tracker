import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OffresService } from './offres.service';
import { OffresController } from './offres.controller';
import { Offre, OffreSchema } from './schemas/offre.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Offre.name, schema: OffreSchema }]),
  ],
  controllers: [OffresController],
  providers: [OffresService],
  exports: [OffresService],
})
export class OffresModule {}