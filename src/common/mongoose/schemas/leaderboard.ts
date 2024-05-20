import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeaderboardDocument = Leaderboard & Document;

@Schema()
export class Leaderboard {
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

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);
