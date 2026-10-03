import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

vi.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  beforeEach(async () => {
    userModel = vi.fn().mockImplementation(function (this: any, data: any) {
      Object.assign(this, data);
      this.save = vi.fn().mockResolvedValue(data);
    });
    userModel.findOne = vi.fn();
    userModel.findByIdAndUpdate = vi.fn();
    userModel.findByIdAndDelete = vi.fn();
    userModel.findById = vi.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('devrait rejeter la création si l\'email existe déjà', async () => {
    userModel.findOne.mockResolvedValue({ _id: 'existant' });

    await expect(
      service.create({ email: 'a@test.com', password: 'motdepasse123' } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('devrait hasher le mot de passe et créer l\'utilisateur si l\'email est libre', async () => {
    userModel.findOne.mockResolvedValue(null);
    (bcrypt.hash as any).mockResolvedValue('motdepasse-hashe');

    await service.create({ email: 'nouveau@test.com', password: 'motdepasse123' } as any);

    expect(bcrypt.hash).toHaveBeenCalledWith('motdepasse123', 10);
  });

  it('devrait rejeter updateMe avec NotFoundException si l\'utilisateur n\'existe pas', async () => {
    userModel.findByIdAndUpdate.mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });

    await expect(service.updateMe('id-inexistant', {} as any)).rejects.toThrow(NotFoundException);
  });

  it('devrait retourner l\'utilisateur mis à jour (update)', async () => {
    userModel.findByIdAndUpdate.mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: 'u1', nom: 'Test' }),
    });

    const result = await service.update('u1', { nom: 'Test' } as any);

    expect(result).toEqual({ _id: 'u1', nom: 'Test' });
  });

  it('devrait supprimer l\'utilisateur (remove)', async () => {
    userModel.findByIdAndDelete.mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: 'u1' }),
    });

    const result = await service.remove('u1');

    expect(result).toEqual({ _id: 'u1' });
  });

  it('devrait rejeter updateCv avec NotFoundException si l\'utilisateur n\'existe pas', async () => {
    userModel.findByIdAndUpdate.mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });

    await expect(service.updateCv('id-inexistant', '/uploads/cv.pdf')).rejects.toThrow(NotFoundException);
  });

  it('devrait mettre à jour le CV si l\'utilisateur existe', async () => {
    userModel.findByIdAndUpdate.mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: 'u1', cvUrl: '/uploads/cv.pdf' }),
    });

    const result = await service.updateCv('u1', '/uploads/cv.pdf');

    expect(result).toEqual({ _id: 'u1', cvUrl: '/uploads/cv.pdf' });
  });

  it('devrait rejeter findMe avec NotFoundException si l\'utilisateur n\'existe pas', async () => {
    userModel.findById.mockResolvedValue(null);

    await expect(service.findMe('id-inexistant')).rejects.toThrow(NotFoundException);
  });
});