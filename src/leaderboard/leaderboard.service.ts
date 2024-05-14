import getLeaderBoardDataFROMJSON from '@/common/utils/getLeaderBoardDataFROMJSON';
import { LeaderboardTypeAnalytics } from '@/types/leaderboard';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  onModuleInit() {
    // TODO: add testing for service and controller
    // TODO: move types
    // TODO: dto for controller
  }

  async getLeaderboardData() {
    return {
      members: getLeaderBoardDataFROMJSON(),
      since: '2021-01-01',
      until: '2021-01-31',
    } as LeaderboardTypeAnalytics;
  }
}
