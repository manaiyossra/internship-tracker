import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidaturesService } from './candidatures.service';
import { CandidaturesController } from './candidatures.controller';
import { Candidature, CandidatureSchema } from './schemas/candidature.schema';
import { OffresModule } from '../offres/offres.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Candidature.name, schema: CandidatureSchema }]),
    OffresModule,
    UsersModule,
  ],
  controllers: [CandidaturesController],
  providers: [CandidaturesService],
})
export class CandidaturesModule {}