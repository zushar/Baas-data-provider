import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubGqlModule } from '@/github-gql/github-gql.module';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller'; // Import the LeaderboardController
import {
  Leaderboard,
  LeaderboardSchema,
} from '@/common/mongoose/schemas/leaderboard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Leaderboard.name, schema: LeaderboardSchema },
    ]),
    GithubGqlModule,
  ],
  controllers: [LeaderboardController], // Register the LeaderboardController
  providers: [LeaderboardService],
})
export class LeaderboardModule {}
