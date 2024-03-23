import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { CreateMemberDto } from '../common/dto/member';

describe('MembersController', () => {
  let controller: MembersController;
  let membersService: MembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: MembersService,
          useValue: {
            create: jest.fn(),
            createMany: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MembersController>(MembersController);
    membersService = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create method of MembersService with single member', async () => {
      const createMemberDto: CreateMemberDto = {
        name: 'John Doe',
        discordUser: 'johndoe#1234',
        links: {
          github: 'ss',
          linkedIn: 'ss',
        },
        description: 'A description',
      };

      await controller.create(createMemberDto);

      expect(membersService.create).toHaveBeenCalledWith(createMemberDto);
    });

    it('should call createMany method of MembersService with multiple members', async () => {
      const createMemberDtos: CreateMemberDto[] = [
        /* array of createMemberDto details */
      ];

      await controller.create(createMemberDtos);

      expect(membersService.createMany).toHaveBeenCalledWith(createMemberDtos);
    });
  });
});
