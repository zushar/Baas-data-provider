import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LinksDto {
  @IsNotEmpty()
  @IsUrl()
  github: string;

  @IsUrl()
  linkedIn: string;
}

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  discordUser: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => LinksDto)
  links: LinksDto;

  @IsString()
  description: string;
}
