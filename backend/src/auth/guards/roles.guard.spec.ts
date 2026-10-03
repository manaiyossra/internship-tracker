// backend/src/auth/guards/roles.guard.spec.ts
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: any;

  function createContext(role: string): ExecutionContext {
    return {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role } }),
      }),
    } as any;
  }

  beforeEach(() => {
    reflector = { get: vi.fn() };
    guard = new RolesGuard(reflector);
  });

  it('devrait autoriser si aucun rôle n\'est requis sur la route', () => {
    reflector.get.mockReturnValue(undefined);

    expect(guard.canActivate(createContext('candidat'))).toBe(true);
  });

  it('devrait autoriser si le rôle de l\'utilisateur est dans la liste requise', () => {
    reflector.get.mockReturnValue(['admin']);

    expect(guard.canActivate(createContext('admin'))).toBe(true);
  });

  it('devrait refuser si le rôle de l\'utilisateur n\'est pas dans la liste requise', () => {
    reflector.get.mockReturnValue(['admin']);

    expect(guard.canActivate(createContext('candidat'))).toBe(false);
  });
});