import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

export type LeaderboardDocument = HydratedDocument<Leaderboard>;

@Schema()
export class Leaderboard {
  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true, type: [String] })
  languages: string[];
}

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);
