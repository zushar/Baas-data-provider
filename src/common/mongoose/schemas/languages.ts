import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

export type LanguageDocument = HydratedDocument<Language>;

@Schema()
export class Language {
  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true, type: [String] })
  languages: string[];
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
