import getLeaderboardDataFromGithub from '@/common/utils/getLeaderBoardDataFromGithub';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  onModuleInit() {
    // Perform initialization tasks here
    console.log('MyService has been initialized');
    // You can also perform asynchronous operations here
  }

  async getLeaderboardData() {
    console.log('getLeaderboardData');

    return (await getLeaderboardDataFromGithub()).data.map(([, data]) => {
      return data;
    });
  }
}
