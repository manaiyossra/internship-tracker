import { Test, TestingModule } from '@nestjs/testing';
import { CandidaturesController } from './candidatures.controller';
import { CandidaturesService } from './candidatures.service';

describe('CandidaturesController', () => {
  let controller: CandidaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidaturesController],
      providers: [CandidaturesService],
    }).compile();

    controller = module.get<CandidaturesController>(CandidaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
