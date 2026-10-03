import { Test, TestingModule } from '@nestjs/testing';
import { OffresController } from './offres.controller';
import { OffresService } from './offres.service';

describe('OffresController', () => {
  let controller: OffresController;
  let offresService: any;

  beforeEach(async () => {
    offresService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffresController],
      providers: [{ provide: OffresService, useValue: offresService }],
    }).compile();

    controller = module.get<OffresController>(OffresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create devrait appeler offresService.create', async () => {
    offresService.create.mockResolvedValue({ _id: 'o1' });

    const result = await controller.create({ titre: 'Dev' } as any);

    expect(offresService.create).toHaveBeenCalledWith({ titre: 'Dev' });
    expect(result).toEqual({ _id: 'o1' });
  });

  it('findAll devrait appeler offresService.findAll avec les query params', async () => {
    offresService.findAll.mockResolvedValue({ data: [], total: 0, page: 1, totalPages: 0 });

    const result = await controller.findAll({ type: 'presentiel' } as any);

    expect(offresService.findAll).toHaveBeenCalledWith({ type: 'presentiel' });
    expect(result).toEqual({ data: [], total: 0, page: 1, totalPages: 0 });
  });

  it('findOne devrait appeler offresService.findOne', async () => {
    offresService.findOne.mockResolvedValue({ _id: 'o1' });

    const result = await controller.findOne('o1');

    expect(offresService.findOne).toHaveBeenCalledWith('o1');
    expect(result).toEqual({ _id: 'o1' });
  });

  it('update devrait appeler offresService.update', async () => {
    offresService.update.mockResolvedValue({ _id: 'o1', titre: 'Modifié' });

    const result = await controller.update('o1', { titre: 'Modifié' } as any);

    expect(offresService.update).toHaveBeenCalledWith('o1', { titre: 'Modifié' });
    expect(result).toEqual({ _id: 'o1', titre: 'Modifié' });
  });

  it('remove devrait appeler offresService.remove', async () => {
    offresService.remove.mockResolvedValue(undefined);

    await controller.remove('o1');

    expect(offresService.remove).toHaveBeenCalledWith('o1');
  });
});