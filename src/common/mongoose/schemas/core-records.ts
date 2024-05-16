import {
  CoreRecordTypeName,
  ICoreRecord,
  RecordType,
} from '@/types/core-records';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

export type CoreRecordDocument = HydratedDocument<CoreRecord>;

@Schema()
export class CoreRecord implements ICoreRecord {
  @Prop({ required: true })
  record: RecordType;

  @Prop({ required: true })
  type: CoreRecordTypeName;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  updatedBy: Date | null;

  @Prop({ required: false })
  archivedAt: Date | null;

  @Prop({ required: false })
  archivedBy: string | null;
}

export type FilterCoreRecords = Partial<Record<keyof CoreRecord, never>>;
export const CoreRecordSchema = SchemaFactory.createForClass(CoreRecord);
