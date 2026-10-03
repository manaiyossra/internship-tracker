import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CandidaturesService } from './candidatures.service';
import { Candidature } from './schemas/candidature.schema';
import { OffresService } from '../offres/offres.service';
import { UsersService } from '../users/users.service';

describe('CandidaturesService', () => {
  let service: CandidaturesService;
  let candidatureModel: any;
  let offresService: any;
  let usersService: any;

  beforeEach(async () => {
    offresService = { findOne: vi.fn() };
    usersService = { findOne: vi.fn() };

    candidatureModel = vi.fn().mockImplementation(function (this: any, data: any) {
      Object.assign(this, data);
      this.save = vi.fn().mockResolvedValue(data);
    });
    candidatureModel.findOne = vi.fn();
    candidatureModel.find = vi.fn();
    candidatureModel.findByIdAndUpdate = vi.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidaturesService,
        { provide: getModelToken(Candidature.name), useValue: candidatureModel },
        { provide: OffresService, useValue: offresService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<CandidaturesService>(CandidaturesService);
  });

  it('devrait rejeter si l\'utilisateur n\'a pas de CV', async () => {
    offresService.findOne.mockResolvedValue({ _id: 'offre1' });
    usersService.findOne.mockResolvedValue({ cvUrl: null });

    await expect(
      service.create('user1', { offre: 'offre1' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('devrait rejeter si l\'utilisateur a déjà postulé (doublon)', async () => {
    offresService.findOne.mockResolvedValue({ _id: 'offre1' });
    usersService.findOne.mockResolvedValue({ cvUrl: '/uploads/cv.pdf' });
    candidatureModel.findOne.mockResolvedValue({ _id: 'existante' });

    await expect(
      service.create('user1', { offre: 'offre1' } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('devrait créer la candidature si tout est valide', async () => {
    offresService.findOne.mockResolvedValue({ _id: 'offre1' });
    usersService.findOne.mockResolvedValue({ cvUrl: '/uploads/cv.pdf' });
    candidatureModel.findOne.mockResolvedValue(null);

    const result = await service.create('user1', { offre: 'offre1' } as any);

    expect(result).toBeDefined();
  });

  it('devrait retourner les candidatures de l\'utilisateur', async () => {
    const fakeCandidatures = [{ _id: 'c1' }];
    candidatureModel.find.mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(fakeCandidatures),
    });

    const result = await service.findMine('user1');

    expect(candidatureModel.find).toHaveBeenCalledWith({ utilisateur: 'user1' });
    expect(result).toEqual(fakeCandidatures);
  });

  it('devrait mettre à jour le statut si la candidature existe', async () => {
    candidatureModel.findByIdAndUpdate.mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: 'c1', statut: 'entretien' }),
    });

    const result = await service.updateStatut('c1', 'entretien');

    expect(result).toEqual({ _id: 'c1', statut: 'entretien' });
  });

  it('devrait rejeter avec NotFoundException si la candidature n\'existe pas (updateStatut)', async () => {
    candidatureModel.findByIdAndUpdate.mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });

    await expect(service.updateStatut('id-inexistant', 'entretien')).rejects.toThrow(NotFoundException);
  });
});