import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: LeaderboardService) {}

  @Get('/')
  async getMostRecentDataPaginated() {
    return this.projectsService.getLeaderboardData();
  }
}
