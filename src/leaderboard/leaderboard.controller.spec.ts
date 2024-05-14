import { LeaderboardAnalyticsSchema } from '@/types/leaderboard';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

describe('Leaderboard controller', () => {
  const service = new LeaderboardService();
  const controller = new LeaderboardController(service);
  it('error should be undefined', async () => {
    const data = controller.getMostRecentDataPaginated();
    const parsed = LeaderboardAnalyticsSchema.safeParse(data);
    expect(parsed.error).toBe(undefined);
  });
});
