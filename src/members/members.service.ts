import { Injectable, BadRequestException } from '@nestjs/common';
import { Member, type MemberDocument } from '../common/mongoose/schemas/member';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { type CreateMemberDto } from '../common/dto/member';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
  ) {}

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
