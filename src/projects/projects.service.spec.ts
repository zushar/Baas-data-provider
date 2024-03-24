import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { GithubGqlService } from '@/github-gql/github-gql.service';
import { Project, ProjectSchema } from '@/common/mongoose/schemas/project';
import { Language, LanguageSchema } from '@/common/mongoose/schemas/languages';
import { Model } from 'mongoose';
import { IGQLProjectResponse } from '@/types/project';
import { IGithubGQLResponse } from '@/types';
import makeMockProject from '@/../test/mocks/projects';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import {
  TestDbModule,
  closeInMongodConnection,
} from '@/../test/mocks/module/mongo-in-memory';

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
        // Include any setup for in-memory MongoDB here
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectModel = module.get<Model<Project>>(getModelToken('Project'));
    languageModel = module.get<Model<Language>>(getModelToken('Language'));

    // Mock the GithubGqlService if you don't want to hit the actual GitHub API in tests
    // Reset mocks before each test to clear previous calls and set the specific behavior for getProjects
    mockGithubGqlService.getProjects.mockReset();
    mockGithubGqlService.getProjects.mockImplementation(
      async (): Promise<IGithubGQLResponse<IGQLProjectResponse>[]> => {
        return mockProjectsArray.map((project) => {
          return {
            item: project,
            error: null,
            meta: { link: project.data.repository.url },
          };
        });
      },
    );
  });

  afterEach(async () => {
    // Clean up database after each test
    await projectModel.deleteMany({});
    await languageModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection(); // Close the database connection after all tests
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Project fetching and saving', () => {
    it('should fetch projects from GitHub and save them to the database', async () => {
      await service.saveProjects();

      // Verify projects and languages were saved correctly
      const savedProjects = await projectModel.find();
      expect(savedProjects).toHaveLength(2 /*mockProjectsArray.length*/);

      const savedLanguages = await languageModel.find();
      // example  [{"__v": 0, "_id": "66003ae19794ec210c3d534a", "languages": ["JavaScript", "CSS", "HTML"], "timestamp": 2024-03-24T14:38:25.869Z}]
      expect(savedLanguages).toHaveLength(1);

      // Additional assertions as necessary
    });
  });

  // Add more tests as necessary
});
