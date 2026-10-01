import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offre } from '../offres/schemas/offre.schema';
import { Candidature } from '../candidatures/schemas/candidature.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Offre.name) private offreModel: Model<Offre>,
    @InjectModel(Candidature.name) private candidatureModel: Model<Candidature>,
  ) {}

  async getStats() {
    const nbOffres = await this.offreModel.countDocuments();
    const nbCandidatures = await this.candidatureModel.countDocuments();

    const repartitionParStatutRaw = await this.candidatureModel.aggregate([
      { $group: { _id: '$statut', count: { $sum: 1 } } },
    ]);

    // transforme [{ _id: 'envoyée', count: 3 }, ...] en { envoyée: 3, ... }
    const repartitionParStatut = repartitionParStatutRaw.reduce(
      (acc, item) => ({ ...acc, [item._id]: item.count }),
      {},
    );

    return { nbOffres, nbCandidatures, repartitionParStatut };
  }
}