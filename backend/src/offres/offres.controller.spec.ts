import { Test, TestingModule } from '@nestjs/testing';
import { OffresController } from './offres.controller';
import { OffresService } from './offres.service';

describe('OffresController', () => {
  let controller: OffresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffresController],
      providers: [OffresService],
    }).compile();

    controller = module.get<OffresController>(OffresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
