import { LeaderboardAnalyticsSchema } from '@/types/leaderboard';
import { LeaderboardService } from './leaderboard.service';

describe('GithubGqlService', () => {
  const service = new LeaderboardService();
  it('Parse Leaderboard data. got the worng data', async () => {
    const data = await service.getLeaderboardData();
    const parsedData = LeaderboardAnalyticsSchema.safeParse(data);
    expect(parsedData.error).toBe(undefined);
  });
});
