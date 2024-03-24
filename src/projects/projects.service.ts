import {
  Language,
  LanguageDocument,
} from '@/common/mongoose/schemas/languages';
import { Project, ProjectDocument } from '@/common/mongoose/schemas/project';
import { GithubGqlService } from '@/github-gql/github-gql.service';
import { IGithubGQLResponse } from '@/types';
import { IGQLProjectResponse } from '@/types/project';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';

@Injectable()
export class ProjectsService implements OnModuleInit {
  constructor(
    private readonly githubGqlService: GithubGqlService,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Language.name)
    private readonly languageModel: Model<LanguageDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.handleCron();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    await this.saveProjects();
  }

  private async getProjectsFromGithub() {
    const projectData = await this.githubGqlService.getProjects();
    const languages = this.getLanguages(projectData);

    return { projectData, languages, timestamp: new Date() };
  }

  async saveProjects() {
    const { projectData, languages, timestamp } =
      await this.getProjectsFromGithub();
    try {
      await this.saveLanguageToDb(languages, timestamp);

      await Promise.all(
        projectData.map((project) => this.saveProjectToDb(project, timestamp)),
      );
    } catch (error) {
      Logger.error('Error saving data', error);
    }
  }

  private async saveLanguageToDb(languages, timestamp) {
    try {
      const newLanguageDocument = new this.languageModel({
        timestamp,
        languages,
      });

      await newLanguageDocument.save();
    } catch (error) {
      Logger.error(error);
    }
  }

  private async saveProjectToDb(project, timestamp) {
    try {
      const newProjectDocument = new this.projectModel({
        timestamp,
        item: project.item,
        error: project.error,
        meta: { link: project.meta.link },
      });

      await newProjectDocument.save();
    } catch (error) {
      Logger.error(error);
    }
  }

  private getLanguages(
    projects: IGithubGQLResponse<IGQLProjectResponse>[],
  ): string[] {
    // create a array of unique languages
    const languages = projects.reduce((acc: string[], project) => {
      const languages = project.item?.data?.repository.languages?.edges?.map(
        (edge) => edge.node.name,
      );
      if (!languages) return acc;
      languages.forEach((tag) => {
        acc.push(tag);
      });
      return acc;
    }, []);

    // return a set of unique languages
    return [...new Set(languages)];
  }
}
