import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OffresService } from './offres.service';
import { Offre } from './schemas/offre.schema';

describe('OffresService', () => {
  let service: OffresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffresService,
        { provide: getModelToken(Offre.name), useValue: {} },
      ],
    }).compile();

    service = module.get<OffresService>(OffresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});