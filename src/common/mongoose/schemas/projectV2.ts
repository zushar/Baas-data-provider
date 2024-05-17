import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Infer the TypeScript type from the summary schema
export type ProjectDocumentV2 = HydratedDocument<ProjectV2>;

@Schema()
export class ProjectV2 {
  @Prop({ required: true })
  timestamp: string;

  @Prop({
    type: {
      name: { type: String, default: null },
      owner: {
        id: { type: String, default: null },
        login: { type: String, default: null },
        avatarUrl: { type: String, default: null },
      },
      description: { type: String, default: null },
      url: { type: String, default: null },
      stargazerCount: { type: Number, default: null },
      languages: { type: [String], default: null },
      contributors: [
        {
          login: { type: String, default: null },
          avatarUrl: { type: String, default: null },
        },
      ],
      createdAt: { type: String, default: null },
      updatedAt: { type: String, default: null },
    },
    required: true,
  })
  repository: {
    name: string | null;
    owner: {
      id: string | null;
      login: string | null;
      avatarUrl: string | null;
    } | null;
    description: string | null;
    url: string | null;
    stargazerCount: number | null;
    languages: (string | null)[] | null;
    contributors:
      | {
          login: string | null;
          avatarUrl: string | null;
        }[]
      | null;
    createdAt: string | null | Date;
    updatedAt: string | null | Date;
  };

  @Prop({
    type: [
      {
        type: { type: String, default: null },
        message: { type: String, default: null },
      },
    ],
    default: [],
  })
  errors: {
    type: string | null;
    message: string | null;
  }[];
}

// Create the schema factory
export const ProjectSchemaV2 = SchemaFactory.createForClass(ProjectV2);
