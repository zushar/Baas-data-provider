import { Test, TestingModule } from '@nestjs/testing';
import { CoreRecordsController } from './core-records.controller';

describe('CoreRecordsController', () => {
  let controller: CoreRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreRecordsController],
    }).compile();

    controller = module.get<CoreRecordsController>(CoreRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
