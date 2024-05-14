import getLeaderBoardDataFROMJSON from '@/common/utils/getLeaderBoardDataFROMJSON';
import { LeaderboardAnalyticsSchema } from '@/types/leaderboard';

describe('GithubGqlService', () => {
  it('Should parse successfully the data from the JSON file', () => {
    const data = getLeaderBoardDataFROMJSON();
    expect(true).toBe(LeaderboardAnalyticsSchema.safeParse(data).success);
  });
});
