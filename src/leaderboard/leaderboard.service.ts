import { AnalyticsDto } from '@/common/dto/leaderboard';
import getLeaderBoardDataFROMJSON from '@/common/utils/getLeaderBoardDataFROMJSON';
import getLeaderboardDataFromGithub from '@/common/utils/getLeaderBoardDataFromGithubV2';
import { ProjectsService } from '@/projects/projects.service';
import { LeaderboardTypeAnalytics } from '@/types/leaderboard';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Leaderboard,
  LeaderboardDocument,
} from '@/common/mongoose/schemas/leaderboard';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  constructor(
    @InjectModel(Leaderboard.name)
    private readonly LeaderboardModel: Model<LeaderboardDocument>,
    private projectsService: ProjectsService,
  ) {}
  async onModuleInit() {
    await this.deleteAllMembers();
    await this.handleCron();
  }

  @Cron('0 8 * * 0') // Cron expression for 8:00 AM every Sunday
  async handleCron() {
    console.log('Running fetch and store Contributors cron job');
    await this.fetchAndStoreMembers();
  }

  private async fetchAndStoreMembers() {
    const { membersData, timestamp } = await this.fethLeaderBoardDataFROMJSON();

    await Promise.all(
      membersData.map((memberData) => {
        return this.saveFetchedFromGithubContributorToDb(memberData, timestamp);
      }),
    );
  }

  private async saveFetchedFromGithubContributorToDb(memberData, timestamp) {
    try {
      //createOrUpdate member
      //to do - check timestamp in schema
      await this.LeaderboardModel.findOneAndUpdate(
        {
          node_id: memberData.node_id,
        },
        {
          name: memberData.name,
          node_id: memberData.node_id,
          projects_names: memberData.projects_names,
          avatar_url: memberData.avatar_url,
          score: memberData.score,
          stats: memberData.stats,
          timestamp,
        },
        { upsert: true },
      );
    } catch (error) {
      console.error('Error saving member to db', error);
    }
  }

  private async fethLeaderBoardDataFROMJSON() {
    const membersData = getLeaderBoardDataFROMJSON();
    const timestamp = new Date();
    return { membersData, timestamp };
  }

  async getLeaderboardDataFromDB(): Promise<AnalyticsDto> {
    const since = 0;
    const until = 0;
    return {
      members: await this.LeaderboardModel.find({
        timestamp: { $gte: new Date(since), $lte: new Date(until) },
      }),
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

  private async deleteAllMembers() {
    await this.LeaderboardModel.deleteMany({});
  }
}
