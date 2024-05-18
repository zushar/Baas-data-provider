import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubGqlModule } from '@/github-gql/github-gql.module';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller'; // Import the LeaderboardController
import {
  Leaderboard,
  LeaderboardSchema,
} from '@/common/mongoose/schemas/leaderboard';
import { ProjectsModule } from '@/projects/projects.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Leaderboard.name, schema: LeaderboardSchema },
    ]),
    GithubGqlModule,
    ProjectsModule,
  ],
  controllers: [LeaderboardController], // Register the LeaderboardController
  providers: [LeaderboardService],
})
export class LeaderboardModule {}
