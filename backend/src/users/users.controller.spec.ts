// users.controller.spec.ts — fichier complet
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: any;

  beforeEach(async () => {
    usersService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      updateCv: vi.fn(),
      updateLettreMotivation: vi.fn(),
      findMe: vi.fn(),
      updateMe: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create devrait appeler usersService.create', async () => {
    usersService.create.mockResolvedValue({ _id: 'u1' });

    const result = await controller.create({ email: 'a@test.com' } as any);

    expect(usersService.create).toHaveBeenCalledWith({ email: 'a@test.com' });
    expect(result).toEqual({ _id: 'u1' });
  });

  it('findAll devrait appeler usersService.findAll', async () => {
    usersService.findAll.mockResolvedValue([{ _id: 'u1' }]);

    const result = await controller.findAll();

    expect(result).toEqual([{ _id: 'u1' }]);
  });

  it('getMe devrait appeler usersService.findMe avec l\'id de l\'utilisateur connecté', async () => {
    usersService.findMe.mockResolvedValue({ _id: 'u1' });

    const result = await controller.getMe({ user: { userId: 'u1' } });

    expect(usersService.findMe).toHaveBeenCalledWith('u1');
    expect(result).toEqual({ _id: 'u1' });
  });

  it('updateMe devrait appeler usersService.updateMe avec l\'id de l\'utilisateur connecté', async () => {
    usersService.updateMe.mockResolvedValue({ _id: 'u1', nom: 'Test' });

    const result = await controller.updateMe({ user: { userId: 'u1' } }, { nom: 'Test' } as any);

    expect(usersService.updateMe).toHaveBeenCalledWith('u1', { nom: 'Test' });
    expect(result).toEqual({ _id: 'u1', nom: 'Test' });
  });

  it('findOne devrait appeler usersService.findOne', async () => {
    usersService.findOne.mockResolvedValue({ _id: 'u1' });

    const result = await controller.findOne('u1');

    expect(usersService.findOne).toHaveBeenCalledWith('u1');
    expect(result).toEqual({ _id: 'u1' });
  });

  it('update devrait appeler usersService.update', async () => {
    usersService.update.mockResolvedValue({ _id: 'u1', nom: 'Modifié' });

    const result = await controller.update('u1', { nom: 'Modifié' } as any);

    expect(usersService.update).toHaveBeenCalledWith('u1', { nom: 'Modifié' });
    expect(result).toEqual({ _id: 'u1', nom: 'Modifié' });
  });

  it('remove devrait appeler usersService.remove', async () => {
    usersService.remove.mockResolvedValue({ _id: 'u1' });

    const result = await controller.remove('u1');

    expect(usersService.remove).toHaveBeenCalledWith('u1');
    expect(result).toEqual({ _id: 'u1' });
  });

  it('uploadCv devrait appeler usersService.updateCv avec le chemin du fichier', async () => {
    usersService.updateCv.mockResolvedValue({ _id: 'u1', cvUrl: '/uploads/cv/fake.pdf' });

    const result = await controller.uploadCv(
      { user: { userId: 'u1' } },
      { filename: 'fake.pdf' } as any,
    );

    expect(usersService.updateCv).toHaveBeenCalledWith('u1', '/uploads/cv/fake.pdf');
    expect(result).toEqual({ _id: 'u1', cvUrl: '/uploads/cv/fake.pdf' });
  });

  it('uploadLettreMotivation devrait appeler usersService.updateLettreMotivation avec le chemin du fichier', async () => {
    usersService.updateLettreMotivation.mockResolvedValue({
      _id: 'u1',
      lettreMotivationUrl: '/uploads/lettres/fake.pdf',
    });

    const result = await controller.uploadLettreMotivation(
      { user: { userId: 'u1' } },
      { filename: 'fake.pdf' } as any,
    );

    expect(usersService.updateLettreMotivation).toHaveBeenCalledWith('u1', '/uploads/lettres/fake.pdf');
    expect(result).toEqual({ _id: 'u1', lettreMotivationUrl: '/uploads/lettres/fake.pdf' });
  });
});