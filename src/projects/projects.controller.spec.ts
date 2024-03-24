import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectPaginationFilter } from '@/types/project';
import { ProjectPaginationRequestBodyDto } from '@/common/dto/project';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let mockProjectsService: Partial<ProjectsService>;

  beforeEach(async () => {
    // Create a mock for ProjectsService with a jest.fn for getMostrecentDataPaginated
    mockProjectsService = {
      getMostrecentDataPaginated: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getMostRecentDataPaginated should call service with correct parameters', async () => {
    const dto = new ProjectPaginationRequestBodyDto(
      1,
      10,
      ProjectPaginationFilter.ALL,
    );
    await controller.getMostRecentDataPaginated(dto);

    expect(mockProjectsService.getMostrecentDataPaginated).toHaveBeenCalledWith(
      dto,
    );
  });
});
