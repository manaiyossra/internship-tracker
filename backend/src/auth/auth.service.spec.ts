import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

vi.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let jwtService: any;

  beforeEach(async () => {
    usersService = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };
    jwtService = {
      sign: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('devrait rejeter le login si l\'email n\'existe pas', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'inconnu@test.com', password: 'motdepasse' } as any),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('devrait rejeter le login si le mot de passe est incorrect', async () => {
    usersService.findByEmail.mockResolvedValue({
      _id: 'u1',
      email: 'a@test.com',
      password: 'hashed',
      role: 'candidat',
    });
    (bcrypt.compare as any).mockResolvedValue(false);

    await expect(
      service.login({ email: 'a@test.com', password: 'mauvais' } as any),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('devrait retourner un token si les identifiants sont corrects', async () => {
    usersService.findByEmail.mockResolvedValue({
      _id: 'u1',
      email: 'a@test.com',
      password: 'hashed',
      role: 'candidat',
    });
    (bcrypt.compare as any).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('un-faux-token');

    const result = await service.login({ email: 'a@test.com', password: 'bon' } as any);

    expect(result).toEqual({ access_token: 'un-faux-token' });
  });

  it('devrait toujours forcer le rôle "candidat" à l\'inscription, même si le client en envoie un autre', async () => {
    usersService.create.mockResolvedValue({});

    await service.register({
      email: 'nouveau@test.com',
      password: 'motdepasse123',
      nom: 'Test',
      prenom: 'Test',
      role: 'admin', // tentative malveillante, doit être ignorée
    } as any);

    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'candidat' }),
    );
  });
});