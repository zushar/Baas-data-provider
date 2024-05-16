import { AnalyticsDto } from '@/common/dto/leaderboard';
import getLeaderBoardDataFROMJSON from '@/common/utils/getLeaderBoardDataFROMJSON';
import { LeaderboardTypeAnalytics } from '@/types/leaderboard';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  onModuleInit() {}

  async getLeaderboardData(): Promise<AnalyticsDto> {
    const since = '2024-01-05T00:00:00Z';
    const until = '2024-04-12T00:00:00Z';
    return {
      members: getLeaderBoardDataFROMJSON(),
      since,
      until,
    } as LeaderboardTypeAnalytics;
  }
}