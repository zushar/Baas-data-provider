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
            getLeaderboardDataFROMJSON: jest.fn().mockResolvedValue([]),
            getLeaderboardDataFromDB: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<LeaderboardController>(LeaderboardController);
  });

  it.skip('should return leaderboard data from JSON', async () => {
    const data = await controller.getMostRecentData();
    const parsed = LeaderboardAnalyticsSchema.safeParse(data);
    expect(parsed.error).toBeUndefined();
  });

  it.skip('should return leaderboard data from DB', async () => {
    const data = await controller.getMostRecentFromDB();
    const parsed = LeaderboardAnalyticsSchema.safeParse(data);
    expect(parsed.error).toBeUndefined();
  });
});
