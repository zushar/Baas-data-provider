import getLeaderBoardDataFROMJSON from '@/common/utils/getLeaderBoardDataFROMJSON';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  onModuleInit() {
    // TODO: add testing for service and controller
    // TODO: move types
    // TODO: dto for controller
  }

  async getLeaderboardData() {
    return getLeaderBoardDataFROMJSON();
  }
}
