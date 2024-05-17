import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly projectsService: LeaderboardService) {}

  @Get('/')
  async getMostRecentDataPaginated() {
    return this.projectsService.getLeaderboardDataV2();
  }
}
