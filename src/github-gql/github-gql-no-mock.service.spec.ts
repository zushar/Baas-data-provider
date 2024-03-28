import { Test, TestingModule } from '@nestjs/testing';
import { GithubGqlService } from './github-gql.service';
import { queryProjectDetails } from './queries/projects';
import { AnyVariables, Client, fetchExchange } from '@urql/core';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { RootConfig, validate } from '@/config/env.validation';
import { IGQLProjectResponse } from '@/types/project';

// ONLY RUN MANUALLY FOR SANITY CHECK AND WHILE DEVELOPING
describe.skip('GithubGqlService', () => {
  let service: GithubGqlService;
  const repoParams: AnyVariables = {
    owner: 'baruchiro',
    name: 'url-title-preview',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypedConfigModule.forRoot({
          isGlobal: true,
          schema: RootConfig,
          validate,
          load: dotenvLoader({
            envFilePath: '.env.test.local',
          }),
        }),
      ],
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
    }).compile();

    service = module.get<GithubGqlService>(GithubGqlService);
  });

  describe('query', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should send a query', async () => {
      const result: IGQLProjectResponse = await service['query'](
        queryProjectDetails,
        repoParams,
      );

      expect(result?.data?.repository.name).toBe(repoParams.name);
    });
  });

  describe('getProjects', () => {
    it('should fetch array of project responses', async () => {
      const result = await service.getProjects();
      expect(result).toBeDefined();
    });
  });

  describe('getMembers', () => {
    it('should fetch a single project response', async () => {
      const result = await service.getMembers();
      expect(result).toBeDefined();
    });
  });
});
