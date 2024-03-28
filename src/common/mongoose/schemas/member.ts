import { IGQLMembersResponse } from '@/types/member';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type MemberDocument = HydratedDocument<Member>;

@Schema()
export class Member {
  @Prop({ required: true })
  timestamp: Date;

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

  @Prop({ type: MongooseSchema.Types.Mixed })
  item: IGQLMembersResponse;

  @Prop({ type: MongooseSchema.Types.Mixed })
  error: Error | null;

  @Prop({ required: true, type: Object })
  meta: {
    link: string;
  };
}

export const MemberSchema = SchemaFactory.createForClass(Member);
