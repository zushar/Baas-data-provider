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
    return {
      members: getLeaderBoardDataFROMJSON(),
      since: 0,
      until: 0,
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
