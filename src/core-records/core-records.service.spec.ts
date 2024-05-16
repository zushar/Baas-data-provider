import { Test, TestingModule } from '@nestjs/testing';
import { CoreRecordsService } from './core-records.service';

describe('CoreRecordsService', () => {
  let service: CoreRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreRecordsService],
    }).compile();

    service = module.get<CoreRecordsService>(CoreRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
