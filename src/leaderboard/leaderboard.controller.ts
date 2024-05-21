import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly projectsService: LeaderboardService) {}

  // @Get('/')
  async getMostRecentData() {
    return this.projectsService.getLeaderboardFromGithubV2();
  }

  @Get('/')
  async getMostRecentFromDB() {
    return this.projectsService.getLeaderboardFromDB();
  }
}
