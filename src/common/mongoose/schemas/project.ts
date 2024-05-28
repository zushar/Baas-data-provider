import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { SummaryProjectType } from '@/types/projectV2Schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  item: SummaryProjectType['repository'];

  @Prop({ required: true, type: Object })
  meta: {
    link: string;
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  errorsData: SummaryProjectType['errorsData'];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
