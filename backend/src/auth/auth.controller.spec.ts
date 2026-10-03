import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(async () => {
    authService = {
      register: vi.fn(),
      login: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register devrait appeler authService.register', async () => {
    authService.register.mockResolvedValue({ message: 'Compte créé avec succès' });

    const result = await controller.register({ email: 'a@test.com' } as any);

    expect(authService.register).toHaveBeenCalledWith({ email: 'a@test.com' });
    expect(result).toEqual({ message: 'Compte créé avec succès' });
  });

  it('login devrait appeler authService.login', async () => {
    authService.login.mockResolvedValue({ access_token: 'token' });

    const result = await controller.login({ email: 'a@test.com', password: 'motdepasse' } as any);

    expect(authService.login).toHaveBeenCalledWith({ email: 'a@test.com', password: 'motdepasse' });
    expect(result).toEqual({ access_token: 'token' });
  });
});