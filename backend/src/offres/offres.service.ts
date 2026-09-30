import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offre, OffreDocument } from './schemas/offre.schema';
import { CreateOffreDto } from './dto/create-offre.dto';
import { UpdateOffreDto } from './dto/update-offre.dto';
import { FindOffresDto } from './dto/find-offres.dto';

@Injectable()
export class OffresService {
  constructor(
    @InjectModel(Offre.name) private offreModel: Model<OffreDocument>,
  ) {}

  async create(createOffreDto: CreateOffreDto): Promise<Offre> {
    const offre = new this.offreModel(createOffreDto);
    return offre.save();
  }

  async findAll(query: FindOffresDto) {
  const { type, duree, ville, page = '1', limit = '10' } = query;

  const filter: any = {};
  if (type) filter.type = type;
  if (duree) filter.duree = Number(duree);
  if (ville) filter.ville = { $regex: ville, $options: 'i' };

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    this.offreModel.find(filter).skip(skip).limit(limitNum).exec(),
    this.offreModel.countDocuments(filter).exec(),
  ]);

  return {
    data,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  };
}

  async findOne(id: string): Promise<OffreDocument> {
    const offre = await this.offreModel.findById(id).exec();
    if (!offre) {
      throw new NotFoundException('Offre introuvable');
    }
    return offre;
  }

  async update(id: string, updateOffreDto: UpdateOffreDto): Promise<OffreDocument> {
    const offre = await this.offreModel.findByIdAndUpdate(id, updateOffreDto, { new: true }).exec();
    if (!offre) {
      throw new NotFoundException('Offre introuvable');
    }
    return offre;
  }

  async remove(id: string): Promise<void> {
    const result = await this.offreModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Offre introuvable');
    }
  }
}