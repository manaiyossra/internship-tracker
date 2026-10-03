import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
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
    candidatureModel = {
  findOne: vi.fn(),
};
offresService = {
  findOne: vi.fn(),
};
usersService = {
  findOne: vi.fn(),
};

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
});