import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candidature, CandidatureDocument } from './schemas/candidature.schema';
import { CreateCandidatureDto } from './dto/create-candidature.dto';
import { OffresService } from '../offres/offres.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CandidaturesService {
  constructor(
    @InjectModel(Candidature.name) private candidatureModel: Model<CandidatureDocument>,
    private offresService: OffresService,
    private usersService: UsersService,
  ) {}

  async create(userId: string, dto: CreateCandidatureDto) {
    await this.offresService.findOne(dto.offre);

    const user = await this.usersService.findOne(userId);
    if (!user?.cvUrl) {
      throw new BadRequestException('Vous devez uploader votre CV avant de postuler');
    }

    const existing = await this.candidatureModel.findOne({
      utilisateur: userId,
      offre: dto.offre,
    });
    if (existing) {
      throw new ConflictException('Vous avez déjà postulé à cette offre');
    }

    const candidature = new this.candidatureModel({
      utilisateur: userId,
      offre: dto.offre,
      notes: dto.notes,
    });
    return candidature.save();
  }

  async findMine(userId: string) {
    return this.candidatureModel
      .find({ utilisateur: userId })
      .populate('offre')
      .exec();
  }

  async updateStatut(id: string, statut: string) {
    const candidature = await this.candidatureModel
      .findByIdAndUpdate(id, { statut }, { new: true })
      .exec();
    if (!candidature) {
      throw new NotFoundException('Candidature introuvable');
    }
    return candidature;
  }
}