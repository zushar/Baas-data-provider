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
      async (): Promise<IGithubGQLResponse<ProjectDBItemType>[]> => {
        return mockProjectsArray.map((project) => {
          return {
            item: project,
            error: null,
            meta: {
              link: 'https://github.com',
            },
          };
        });
      },
    );

    // add languages to the database
    const newLanguages = ['JavaScript', 'CSS', 'HTML'];

    const newLanguageDocument = new languageModel({
      timestamp,
      languages: newLanguages,
    });
    await newLanguageDocument.save();

    // Add projects to the database
    await Promise.all(
      mockProjectsArray.map((project) => {
        const newProjectDocument = new projectModel(project);
        return newProjectDocument.save();
      }),
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

  describe('getPaginatedProjects with filter', () => {
    const dateEarliestCreated = new Date('2023-01-02T00:00:00Z');
    const dateLatestCreated = new Date('2023-01-03T00:00:00Z');
    const dateRecentlyUpdated = new Date('2023-01-03T00:00:00Z');
    const dateLatestUpdated = new Date('2023-01-04T00:00:00Z');

    beforeEach(async () => {
      // Reset and populate the database with mock data suitable for testing each filter
      await projectModel.deleteMany({});
      await languageModel.deleteMany({});

      // Insert languages
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

      // Insert projects with varied createdAt, updatedAt, and contributors for testing
      // Note: Adjust the structure as per your actual model and test requirements
      await projectModel.insertMany([
        { item: mockProjectA, timestamp, meta: {} },
        { item: mockProjectB, timestamp, meta: {} },
      ]);
    });

    it('should return the most recent projects and languages', async () => {
      const req = await service.getAllProjects();
      console.log(req);
      const parsedProjects = ProjectDBItem.array().safeParse(req);
      expect(parsedProjects.error).toBeUndefined();
    });
  });
});
