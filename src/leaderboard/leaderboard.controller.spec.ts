import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardAnalyticsSchema } from '@/types/leaderboard';

describe('LeaderboardController', () => {
  let controller: LeaderboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardController],
      providers: [
        {
          provide: LeaderboardService,
          useValue: {
            getLeaderboardFromDB: jest.fn().mockResolvedValue({
              members: [
                {
                  name: 'testUser',
                  node_id: 'node1',
                  projects_names: [{ url: 'owner1/repo1', name: 'repo1' }],
                  avatar_url: 'url1',
                  score: 10,
                  stats: { additions: 10, deletions: 5, commits: 2 },
                },
              ],
              since: 1622505600, // Example timestamp
              until: 1625097600, // Example timestamp
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<LeaderboardController>(LeaderboardController);
  });

  it('should return leaderboard data from DB', async () => {
    const data = await controller.getMostRecentFromDB();
    const parsed = LeaderboardAnalyticsSchema.safeParse(data);
    expect(parsed.error).toBeUndefined();
  });
});
