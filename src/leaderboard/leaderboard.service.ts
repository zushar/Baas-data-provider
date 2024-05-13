import {
  Leaderboard,
  LeaderboardDocument,
} from '@/common/mongoose/schemas/leaderboard';
import { GithubGqlService } from '@/github-gql/github-gql.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  constructor(
    private readonly githubGqlService: GithubGqlService,
    @InjectModel(Leaderboard.name)
    private readonly projectModel: Model<LeaderboardDocument>,
  ) {}
  onModuleInit() {
    throw new Error('Method not implemented.');
  }
  //   async onModuleInit(): Promise<void> {
  //     await this.handleCron();
  //   }
  //   @Cron(CronExpression.EVERY_5_SECONDS)
  //   async handleCron() {
  //     console.log('Cron job is running');
  //   }

  async getLeaderboardData() {
    return this.projectModel.find();
  }
}
