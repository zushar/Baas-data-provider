import { Body, Controller, Post } from '@nestjs/common';
import { MembersService } from './members.service';
import { type CreateMemberDto } from '../common/dto/member';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  async create(@Body() createMemberDto: CreateMemberDto | CreateMemberDto[]) {
    if (Array.isArray(createMemberDto)) {
      return await this.membersService.createMany(createMemberDto);
    } else {
      return await this.membersService.create(createMemberDto);
    }
  }
}
