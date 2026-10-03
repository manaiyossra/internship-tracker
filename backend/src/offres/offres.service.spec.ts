import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { OffresService } from './offres.service';
import { Offre } from './schemas/offre.schema';

describe('OffresService', () => {
  let service: OffresService;
  let offreModel: any;

  beforeEach(async () => {
    offreModel = vi.fn().mockImplementation(function (this: any, data: any) {
      Object.assign(this, data);
      this.save = vi.fn().mockResolvedValue(data);
    });
    offreModel.find = vi.fn();
    offreModel.countDocuments = vi.fn();
    offreModel.findById = vi.fn();
    offreModel.findByIdAndUpdate = vi.fn();
    offreModel.findByIdAndDelete = vi.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffresService,
        { provide: getModelToken(Offre.name), useValue: offreModel },
      ],
    }).compile();

    service = module.get<OffresService>(OffresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('devrait créer une offre', async () => {
    const result = await service.create({ titre: 'Dev Fullstack' } as any);

    expect(result).toEqual(expect.objectContaining({ titre: 'Dev Fullstack' }));
  });

  it('devrait retourner les offres paginées avec les filtres appliqués', async () => {
    const fakeOffres = [{ _id: '1' }, { _id: '2' }];

    offreModel.find.mockReturnValue({
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(fakeOffres),
    });
    offreModel.countDocuments.mockReturnValue({
      exec: vi.fn().mockResolvedValue(2),
    });

    const result = await service.findAll({ type: 'presentiel', page: '1', limit: '10' } as any);

    expect(offreModel.find).toHaveBeenCalledWith({ type: 'presentiel' });
    expect(result).toEqual({ data: fakeOffres, total: 2, page: 1, totalPages: 1 });
  });

  it('devrait retourner l\'offre si elle existe', async () => {
    offreModel.findById.mockReturnValue({ exec: vi.fn().mockResolvedValue({ _id: '1' }) });

    const result = await service.findOne('1');

    expect(result).toEqual({ _id: '1' });
  });

  it('devrait rejeter avec NotFoundException si l\'offre n\'existe pas (findOne)', async () => {
    offreModel.findById.mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });

    await expect(service.findOne('id-inexistant')).rejects.toThrow(NotFoundException);
  });

  it('devrait mettre à jour l\'offre si elle existe', async () => {
    offreModel.findByIdAndUpdate.mockReturnValue({ exec: vi.fn().mockResolvedValue({ _id: '1', titre: 'Modifié' }) });

    const result = await service.update('1', { titre: 'Modifié' } as any);

    expect(result).toEqual({ _id: '1', titre: 'Modifié' });
  });

  it('devrait rejeter avec NotFoundException si l\'offre n\'existe pas (update)', async () => {
    offreModel.findByIdAndUpdate.mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });

    await expect(service.update('id-inexistant', {} as any)).rejects.toThrow(NotFoundException);
  });

  it('devrait supprimer l\'offre si elle existe', async () => {
    offreModel.findByIdAndDelete.mockReturnValue({ exec: vi.fn().mockResolvedValue({ _id: '1' }) });

    await expect(service.remove('1')).resolves.toBeUndefined();
  });

  it('devrait rejeter avec NotFoundException si l\'offre n\'existe pas (remove)', async () => {
    offreModel.findByIdAndDelete.mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });

    await expect(service.remove('id-inexistant')).rejects.toThrow(NotFoundException);
  });
});