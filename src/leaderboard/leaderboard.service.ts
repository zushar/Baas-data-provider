import getLeaderBoardDataFROMJSON from '@/common/utils/getLeaderBoardDataFROMJSON';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  onModuleInit() {
    // Perform initialization tasks here
    console.log('MyService has been initialized');
    // Cron job to fetch and save leaderboard data into the database
  }

  async getLeaderboardData() {
    // The code below is commented out because should be use when the cron job is implemented
    // return (await getLeaderboardDataFromGithub()).data.map(([, data]) => {
    //   return data;
    // });
    // For now, we will return a static data as json
    return getLeaderBoardDataFROMJSON();
  }
}
