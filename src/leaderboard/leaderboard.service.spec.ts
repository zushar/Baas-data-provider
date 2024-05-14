import getLeaderBoardDataFROMJSON from '@/common/utils/getLeaderBoardDataFROMJSON';
import { LeaderboardAnalyticsSchema } from '@/types/leaderboard';

describe('GithubGqlService', () => {
  it('Should parse successfully the data from the JSON file', () => {
    const data = getLeaderBoardDataFROMJSON();
    const parsedData = LeaderboardAnalyticsSchema.safeParse(data);
    expect(parsedData.error).toBe(undefined);
  });
});
