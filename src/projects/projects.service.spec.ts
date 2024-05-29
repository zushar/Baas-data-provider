import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { GithubGqlService } from '@/github-gql/github-gql.service';
import { Project, ProjectSchema } from '@/common/mongoose/schemas/project';
import { Language, LanguageSchema } from '@/common/mongoose/schemas/languages';
import { Model } from 'mongoose';
import { IGithubGQLResponse } from '@/types';
import makeMockProject from '@/../test/mocks/projects';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import {
  TestDbModule,
  closeInMongodConnection,
} from '@/../test/mocks/module/mongo-in-memory';
import { ProjectDBItem, ProjectDBItemType } from '@/types/projectV2Schema';

const mockProject1 = makeMockProject('project1', 'AAAA', ['JavaScript']);
const mockProject2 = makeMockProject('project2', 'BBBB', [
  'CSS',
  'HTML',
  'JavaScript',
]);

const mockProjectsArray = [mockProject1, mockProject2];

const mockGithubGqlService = {
  getProjects: jest.fn(),
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectModel: Model<Project>;
  let languageModel: Model<Language>;
  const timestamp = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: GithubGqlService, useValue: mockGithubGqlService },
      ],
      imports: [
        TestDbModule,
        MongooseModule.forFeature([
          { name: 'Project', schema: ProjectSchema },
          { name: 'Language', schema: LanguageSchema },
        ]),
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectModel = module.get<Model<Project>>(getModelToken('Project'));
    languageModel = module.get<Model<Language>>(getModelToken('Language'));

    mockGithubGqlService.getProjects.mockReset();
    mockGithubGqlService.getProjects.mockImplementation(
      async (): Promise<IGithubGQLResponse<ProjectDBItemType>[]> => {
        return mockProjectsArray.map((project) => ({
          item: project,
          error: null,
          meta: {
            link: 'https://github.com',
          },
        }));
      },
    );

    const newLanguages = ['JavaScript', 'CSS', 'HTML'];
    const newLanguageDocument = new languageModel({
      timestamp,
      languages: newLanguages,
    });
    await newLanguageDocument.save();

    await Promise.all(
      mockProjectsArray.map((project) => {
        const newProjectDocument = new projectModel(project);
        return newProjectDocument.save();
      }),
    );
  });

  afterEach(async () => {
    await projectModel.deleteMany({});
    await languageModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPaginatedProjects with filter', () => {
    const dateEarliestCreated = new Date('2023-01-02T00:00:00Z');
    const dateLatestCreated = new Date('2023-01-03T00:00:00Z');
    const dateRecentlyUpdated = new Date('2023-01-03T00:00:00Z');
    const dateLatestUpdated = new Date('2023-01-04T00:00:00Z');

    beforeEach(async () => {
      await projectModel.deleteMany({});
      await languageModel.deleteMany({});

      const newLanguages = ['JavaScript', 'CSS', 'HTML'];
      const newLanguageDocument = new languageModel({
        timestamp,
        languages: newLanguages,
      });
      await newLanguageDocument.save();

      const mockProjectA = makeMockProject(
        'project1',
        'AAAA',
        ['JavaScript'],
        dateEarliestCreated,
        dateRecentlyUpdated,
      );
      const mockProjectB = makeMockProject(
        'project2',
        'BBBB',
        ['CSS', 'HTML', 'JavaScript'],
        dateLatestCreated,
        dateLatestUpdated,
      );

      await projectModel.insertMany([mockProjectA, mockProjectB]);
    });

    it('should return the most recent projects and languages', async () => {
      const req = await service.getAllProjects();
      console.log(req);
      const parsedProjects = ProjectDBItem.array().safeParse(req);
      expect(parsedProjects.error).toBeUndefined();
    });
  });
});
