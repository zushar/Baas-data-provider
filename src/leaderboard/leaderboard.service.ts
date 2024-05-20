import { AnalyticsDto } from '@/common/dto/leaderboard';
import getLeaderBoardDataFROMJSON from '@/common/utils/getLeaderBoardDataFROMJSON';
import getLeaderboardDataFromGithub from '@/common/utils/getLeaderBoardDataFromGithubV2';
import { ProjectsService } from '@/projects/projects.service';
import { LeaderboardTypeAnalytics } from '@/types/leaderboard';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  constructor(private projectsService: ProjectsService) {}

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

  async getLeaderboardDataV2(): Promise<AnalyticsDto[]> {
    const allProjects = (await this.projectsService.getAllProjectsV2())
      .map((p) => ({
        owner: p.repository.owner?.login ?? '',
        repo: p.repository.name ?? '',
      }))
      .filter((p) => p.owner && p.repo)
      .slice(0, 3);

    return await getLeaderboardDataFromGithub(allProjects);
  }
}
