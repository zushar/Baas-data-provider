import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

export type MemberDocument = HydratedDocument<Member>;

@Schema()
export class Member {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  discordUser: string;

  @Prop({ required: true, type: Object })
  links: {
    github: string;
    linkedIn: string;
  };

  @Prop()
  description: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
