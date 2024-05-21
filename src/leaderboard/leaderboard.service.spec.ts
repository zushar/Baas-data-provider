import { MongooseModule } from '@nestjs/mongoose';
import { LeaderboardService } from './leaderboard.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '@/projects/projects.service';
import mockProjectsV2 from './fixtures/mock-projects-v2';
import {
  LeaderboardAnalyticsSchema,
  LeaderboardTypeAnalytics,
} from '@/types/leaderboard';
import {
  Leaderboard,
  LeaderboardSchema,
} from '@/common/mongoose/schemas/leaderboard';
import { TestDbModule } from '@/../test/mocks/module/mongo-in-memory';
import { SafeParseReturnType } from 'zod';
import { AnalyticsDto } from '@/common/dto/leaderboard';

const mockProjectsService = {
  getAllProjectsV2: jest.fn().mockResolvedValue(mockProjectsV2),
};

describe('GithubGqlService', () => {});

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let parsedData: SafeParseReturnType<
    AnalyticsDto[],
    LeaderboardTypeAnalytics[]
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardService,
        { provide: ProjectsService, useValue: mockProjectsService },
      ],
      imports: [
        TestDbModule,
        // MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'),
        MongooseModule.forFeature([
          { name: Leaderboard.name, schema: LeaderboardSchema },
        ]),
      ],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
    const data = await service.getLeaderboardFromDB();
    parsedData = LeaderboardAnalyticsSchema.array().safeParse(data);
  });

  it('Parse Leaderboard data. got the worng data', async () => {
    expect(parsedData.error).toBe(undefined);
  });
  it('should parse leaderboard data from JSON without error', async () => {
    expect(parsedData.error).toBeUndefined();
  });

  it('should parse leaderboard data from DB without error', async () => {
    // Check the db for changes
    expect(parsedData.error).toBeUndefined();
  });
});
