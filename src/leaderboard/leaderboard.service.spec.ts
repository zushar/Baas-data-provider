import { LeaderboardAnalyticsSchema } from '@/types/leaderboard';
import { LeaderboardService } from './leaderboard.service';

describe('GithubGqlService', () => {
  const service = new LeaderboardService();
  it('Should parse successfully the data from the JSON file', () => {
    const data = service.getLeaderboardData();
    const parsedData = LeaderboardAnalyticsSchema.safeParse(data);
    expect(parsedData.error).toBe(undefined);
  });
});
