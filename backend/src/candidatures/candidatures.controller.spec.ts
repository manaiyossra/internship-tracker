import { Test, TestingModule } from '@nestjs/testing';
import { CandidaturesController } from './candidatures.controller';
import { CandidaturesService } from './candidatures.service';

describe('CandidaturesController', () => {
  let controller: CandidaturesController;
  let candidaturesService: any;

  beforeEach(async () => {
    candidaturesService = {
      create: vi.fn(),
      findMine: vi.fn(),
      updateStatut: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidaturesController],
      providers: [{ provide: CandidaturesService, useValue: candidaturesService }],
    }).compile();

    controller = module.get<CandidaturesController>(CandidaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create devrait appeler candidaturesService.create avec l\'id de l\'utilisateur connecté', async () => {
    candidaturesService.create.mockResolvedValue({ _id: 'c1' });

    const result = await controller.create(
      { user: { userId: 'u1' } },
      { offre: 'o1' } as any,
    );

    expect(candidaturesService.create).toHaveBeenCalledWith('u1', { offre: 'o1' });
    expect(result).toEqual({ _id: 'c1' });
  });

  it('findMine devrait appeler candidaturesService.findMine avec l\'id de l\'utilisateur connecté', async () => {
    candidaturesService.findMine.mockResolvedValue([{ _id: 'c1' }]);

    const result = await controller.findMine({ user: { userId: 'u1' } });

    expect(candidaturesService.findMine).toHaveBeenCalledWith('u1');
    expect(result).toEqual([{ _id: 'c1' }]);
  });

  it('updateStatut devrait appeler candidaturesService.updateStatut', async () => {
    candidaturesService.updateStatut.mockResolvedValue({ _id: 'c1', statut: 'entretien' });

    const result = await controller.updateStatut('c1', 'entretien');

    expect(candidaturesService.updateStatut).toHaveBeenCalledWith('c1', 'entretien');
    expect(result).toEqual({ _id: 'c1', statut: 'entretien' });
  });
});