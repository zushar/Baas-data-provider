import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

export type LeaderboardDocument = HydratedDocument<Leaderboard>;

@Schema()
export class Leaderboard {}

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);
