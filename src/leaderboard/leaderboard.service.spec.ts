import { LeaderboardAnalyticsSchema } from '@/types/leaderboard';
import { LeaderboardService } from './leaderboard.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '@/projects/projects.service';
import mockProjectsV2 from './fixtures/mock-projects-v2';

const mockProjectsService = {
  getAllProjectsV2: jest.fn().mockResolvedValue(mockProjectsV2),
};

describe('GithubGqlService', () => {
  let service: LeaderboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardService,
        { provide: ProjectsService, useValue: mockProjectsService },
      ],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
  });

  it('Parse Leaderboard data. got the worng data', async () => {
    const data = await service.getLeaderboardDataV2();
    const parsedData = LeaderboardAnalyticsSchema.safeParse(data);
    expect(parsedData.error).toBe(undefined);
  });
});
