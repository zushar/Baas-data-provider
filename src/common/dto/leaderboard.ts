import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class ProjectNameDto {
  @IsString()
  url: string;

  @IsString()
  name: string;
}

class MemberStatsDto {
  @IsNumber()
  additions: number;

  @IsNumber()
  deletions: number;

  @IsNumber()
  commits: number;
}

class MemberDto {
  @IsString()
  name: string;

  @IsString()
  node_id: string;

  @IsArray()
  @Type(() => ProjectNameDto)
  projects_names: ProjectNameDto[];

  @IsString()
  avatar_url: string;

  @IsNumber()
  score: number;

  @IsObject()
  @Type(() => MemberStatsDto)
  stats: MemberStatsDto;
}

export class AnalyticsDto {
  @IsArray()
  @Type(() => MemberDto)
  members: MemberDto[];

  @IsString()
  since: string;

  @IsString()
  until: string;
}
