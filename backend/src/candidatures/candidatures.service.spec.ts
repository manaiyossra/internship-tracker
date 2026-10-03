import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, ConflictException } from '@nestjs/common';
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
    offresService = {
      findOne: vi.fn(),
    };
    usersService = {
      findOne: vi.fn(),
    };

    // candidatureModel doit marcher à la fois comme objet (findOne)
    // et comme constructeur (new candidatureModel(...).save()).
    // vi.fn() PEUT être utilisé avec `new`, donc on lui attache
    // findOne comme propriété en plus de son comportement de constructeur.
    candidatureModel = vi.fn().mockImplementation(function (this: any, data: any) {
      Object.assign(this, data);
      this.save = vi.fn().mockResolvedValue(data);
    });
    candidatureModel.findOne = vi.fn();

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
});