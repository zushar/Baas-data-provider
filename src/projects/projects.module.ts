import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { GithubGqlService } from '@/github-gql/github-gql.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '@/common/mongoose/schemas/project';
import { Language, LanguageSchema } from '@/common/mongoose/schemas/languages';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [ProjectsService],
  controllers: [ProjectsController],
  imports: [
    ScheduleModule.forRoot(),
    GithubGqlService,
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      {
        name: Language.name,
        schema: LanguageSchema,
      },
    ]),
  ],
})
export class ProjectsModule {}
