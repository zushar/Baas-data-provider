import { Test, TestingModule } from '@nestjs/testing';
import { GithubGqlService } from './github-gql.service';
import { queryProjectDetails } from './queries/projects';
import { AnyVariables /*, Client */, Client } from '@urql/core';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { RootConfig, validate } from '@/config/env.validation';

class MockClient {
  query = jest.fn().mockReturnValue({ toPromise: jest.fn() });
}
describe('GithubGqlService', () => {
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
          // provide: Client,
          provide: Client, // Use a custom provider token
          useValue: new MockClient(),
        },
      ],
    }).compile();

    service = module.get<GithubGqlService>(GithubGqlService);
    // mockClient = module.get(Client);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a query', async () => {
    await service.query(queryProjectDetails, repoParams);

    const spyClient = jest.spyOn(service['client'], 'query');

    expect(spyClient).toHaveBeenCalledWith(queryProjectDetails, repoParams);
  });
});
