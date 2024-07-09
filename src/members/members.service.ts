import {
  Injectable,
  BadRequestException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { Member, type MemberDocument } from '../common/mongoose/schemas/member';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { type CreateMemberDto } from '../common/dto/member';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GithubGqlService } from '@/github-gql/github-gql.service';

@Injectable()
export class MembersService implements OnModuleInit {
  constructor(
    private readonly githubGqlService: GithubGqlService,
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.handleCron();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Adjust the cron expression as needed
  async handleCron() {
    Logger.log('Running fetch and store members cron job');
    await this.fetchAndStoreMembers();
  }

  private async fetchAndStoreMembers() {
    const { membersData, timestamp } = await this.fetchMembers();

    await Promise.all(
      membersData.map((memberData) => {
        return this.saveFetchedFromGithubMemberToDb(memberData, timestamp);
      }),
    );
  }

  private async saveFetchedFromGithubMemberToDb(memberData, timestamp) {
    try {
      //createOrUpdate member
      await this.memberModel.findOneAndUpdate(
        {
          discordUser: memberData.meta.discordUser,
        },
        {
          name: memberData.item?.data?.user?.name,
          discordUser: memberData.meta.discordUser,
          links: memberData.meta.links,
          description:
            memberData.item?.data?.user?.bioHTML || memberData.meta.description,
          item: memberData,
          meta: memberData.meta,
          timestamp,
        },
        { upsert: true },
      );
    } catch (error) {
      Logger.error(error);
    }
  }

  private async fetchMembers() {
    const membersData = await this.githubGqlService.getMembers();

    return { membersData, timestamp: new Date() };
  }

  async findAll(): Promise<MemberDocument[]> {
    return this.memberModel.find().exec();
  }

  // TODO - implement storing of members to json from api with create & createMany
  async create(createMemberDto: CreateMemberDto): Promise<MemberDocument> {
    const createdMember = new this.memberModel(createMemberDto);
    return await createdMember.save();
  }

  async createMany(
    createMemberDtos: CreateMemberDto[],
  ): Promise<MemberDocument[]> {
    // Validate each member and check for duplicates
    const uniqueDiscordUsers = new Set<string>();
    const membersToSave: CreateMemberDto[] = [];
    const savedMembers: MemberDocument[] = [];

    createMemberDtos.forEach((createMemberDto) => {
      if (uniqueDiscordUsers.has(createMemberDto.discordUser)) {
        throw new BadRequestException(
          `Duplicate discordUser: ${createMemberDto.discordUser}`,
        );
      }
      uniqueDiscordUsers.add(createMemberDto.discordUser);

      membersToSave.push(createMemberDto);
    });

    for (const createMemberDto of membersToSave) {
      const createdMember = new this.memberModel(createMemberDto);
      const savedMember = await createdMember.save();
      savedMembers.push(savedMember);
    }

    return savedMembers;
  }
}
