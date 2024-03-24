import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { IGQLProjectResponse } from '@/types/project'; // Import the 'IGQLProjectResponse' type

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  item: IGQLProjectResponse;

  @Prop({ type: MongooseSchema.Types.Mixed })
  error: Error | null;

  @Prop({ required: true, type: Object })
  meta: {
    link: string;
  };
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
