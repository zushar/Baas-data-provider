import { Module } from '@nestjs/common';
import { GithubGqlService } from './github-gql.service';
import { Client, fetchExchange } from '@urql/core';
import { RootConfig } from '@/config/env.validation';

@Module({
  providers: [
    GithubGqlService,
    {
      provide: Client,
      useFactory: (configService: RootConfig) => {
        return new Client({
          url: 'https://api.github.com/graphql',
          exchanges: [fetchExchange],
          fetchOptions: () => ({
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${configService.GITHUB_TOKEN}`,
            },
          }),
        });
      },
      inject: [RootConfig],
    },
  ],
  exports: [GithubGqlService],
})
export class GithubGqlModule {}
