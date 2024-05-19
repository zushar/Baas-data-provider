import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaderboardService } from './leaderboard.service';
import {
  Leaderboard,
  LeaderboardSchema,
} from '@/common/mongoose/schemas/leaderboard';
import { LeaderboardAnalyticsSchema } from '@/types/leaderboard';

describe('LeaderboardService', () => {
  let service: LeaderboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'),
        MongooseModule.forFeature([
          { name: Leaderboard.name, schema: LeaderboardSchema },
        ]),
      ],
      providers: [LeaderboardService],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
  });

  it('should parse leaderboard data from JSON without error', async () => {
    const data = await service.getLeaderboardDataFROMJSON();
    const parsedData = LeaderboardAnalyticsSchema.safeParse(data);
    expect(parsedData.error).toBeUndefined();
  });

  it('should parse leaderboard data from DB without error', async () => {
    const data = await service.getLeaderboardDataFromDB();
    const parsedData = LeaderboardAnalyticsSchema.safeParse(data);
    expect(parsedData.error).toBeUndefined();
  });
});
