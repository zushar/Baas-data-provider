import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeaderboardDocument = Leaderboard & Document;

@Schema()
export class Member {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  node_id: string;

  @Prop({ type: [{ url: String, name: String }], required: true })
  projects_names: { url: string; name: string }[];

  @Prop({ required: true })
  avatar_url: string;

  @Prop({ required: true })
  score: number;

  @Prop({ type: Object, required: true })
  stats: {
    additions: number;
    deletions: number;
    commits: number;
  };
}

export const MemberSchema = SchemaFactory.createForClass(Member);

@Schema()
export class Leaderboard {
  @Prop({ type: [MemberSchema], required: true })
  members: Member[];

  @Prop({ required: true })
  since: number;

  @Prop({ required: true })
  until: number;

  @Prop({ required: true, enum: ['allTimes', 'lastMonth', 'lastWeek'] })
  stat: 'allTimes' | 'lastMonth' | 'lastWeek';
}

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);
