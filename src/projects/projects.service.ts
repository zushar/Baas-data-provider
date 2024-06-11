import {
  Language,
  LanguageDocument,
} from '@/common/mongoose/schemas/languages';
import { Project, ProjectDocument } from '@/common/mongoose/schemas/project';

import { GithubGqlService } from '@/github-gql/github-gql.service';
import {
  ProjectPaginationFilter,
  ProjectPaginationRequest,
} from '@/types/project';
import GitHubResponseSchema, {
  SummaryProjectType,
  summarizeGitHubData,
} from '@/types/projectV2Schema';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model, PipelineStage } from 'mongoose';

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

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async handleCron() {
    await this.saveProjects();
    // This ensures that the most recent data is always available
    await this.deletePastDuplicatedProjects();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async WakeUpCron() {
    // TODO: Implement a logic to save it on mongoDB and reset the old data
    console.info('Wake up call');
  }

  async saveProjects() {
    const { projectData, languages, timestamp } =
      await this.getProjectsFromGithub();

    try {
      await this.saveLanguageToDb(languages, timestamp);

      await Promise.all(
        projectData
          .filter((p) => p.repository.name || p.repository.owner?.login) // Filter out projects without owner or repo
          .map((project) => this.saveProjectToDb(project, timestamp)),
      );
      return { success: true, message: 'Data saved successfully' };
    } catch (error) {
      Logger.error('Error saving data', error);
      return { success: false, message: 'Error saving data' };
    }
  }
  async deleteOldProjects() {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 1); // 1 days ago

    await this.projectModel.deleteMany({
      timestamp: { $lte: fiveDaysAgo },
    });
    await this.languageModel.deleteMany({
      timestamp: { $lte: fiveDaysAgo },
    });
  }
  async getMostrecentDataPaginated({
    page,
    limit,
    filter,
  }: ProjectPaginationRequest): Promise<{
    projects: ProjectDocument[];
    timestamp: Date | null;
    pageLanguages: string[];
    total: number;
    languages: string[];
  }> {
    // Query the most recent timestamp from the languages collection
    const languages = await this.getLanguages();

    if (!languages)
      return {
        projects: [],
        timestamp: null,
        total: 0,
        pageLanguages: [],
        languages: [],
      };

    const projects = await this.getPaginatedProjects({
      page,
      limit,
      timestamp: languages?.timestamp,
      filter,
    });

    const totalProjects = await this.projectModel
      .countDocuments({ timestamp: languages.timestamp })
      .exec();

    const pageLanguages = this.buildLanguageUniqueArray(
      projects.map((p) => p.item),
    );

    return {
      projects,
      total: totalProjects,
      languages: languages.languages,
      pageLanguages,
      timestamp: languages.timestamp,
    };
  }
  async getPaginatedProjects({
    page,
    limit,
    timestamp,
    filter,
  }: ProjectPaginationRequest): Promise<ProjectDocument[]> {
    if (filter === ProjectPaginationFilter.MOST_CONTROBUTORS) {
      const aggregationPipeline: PipelineStage[] = [
        { $match: timestamp ? { timestamp: new Date(timestamp) } : {} },
        {
          $addFields: {
            contributorsCount: {
              $size: '$item.contributors',
            },
          },
        },
        { $sort: { contributorsCount: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ];

      return await this.projectModel.aggregate(aggregationPipeline).exec();
    } else {
      let sortCriteria = {};
      const query = {};
      switch (filter) {
        case ProjectPaginationFilter.RECENTLY_UPDATED:
          sortCriteria = { 'item.updatedAt': -1 };
          break;
        case ProjectPaginationFilter.RECENTLY_CREATED:
          sortCriteria = { 'item.createdAt': -1 };
          break;
        case ProjectPaginationFilter.ALL:
        default:
          sortCriteria = { 'item.createdAt': -1 };
          break;
      }

      return await this.projectModel
        .find(query)
        .sort(sortCriteria)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    }
  }
  async getLanguages() {
    const languages = await this.languageModel
      .findOne()
      .sort({ timestamp: -1 })
      .limit(1)
      .exec();

    return languages;
  }
  private async getProjectsFromGithub() {
    const projectData = await this.githubGqlService.getProjects();
    const parse = GitHubResponseSchema.array().safeParse(projectData);
    if (!parse.success) {
      throw new Error(`Failed to parse GitHub response: ${parse.error}`);
    }
    const summary = summarizeGitHubData(parse.data);

    const languages = this.buildLanguageUniqueArray(
      summary.map((p) => p.repository),
    );

    return { projectData: summary, languages, timestamp: new Date() };
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
  private async saveProjectToDb(project: SummaryProjectType, timestamp) {
    try {
      const newProjectDocument = new this.projectModel({
        timestamp,
        item: project.repository,
        meta: { link: project.repository.url },
        errorsData: project.errorsData,
      });

      await newProjectDocument.save();
    } catch (error) {
      Logger.error(error);
    }
  }
  private buildLanguageUniqueArray(
    projects: SummaryProjectType['repository'][],
  ): string[] {
    // create a array of unique languages

    const languages = projects
      .flatMap((p) => {
        return p?.languages ?? [];
      })
      .filter((l) => l) as string[];

    // return a set of unique languages
    return Array.from(new Set(languages));
  }
  async getAllProjects() {
    return await this.projectModel.find({}).exec();
  }
  async deletePastDuplicatedProjects() {
    try {
      // Retrieve all projects from the database
      const projects = await this.getAllProjects();

      // Sort projects by update time, treating null as the oldest date
      projects.sort((a, b) => {
        const dateA = a.item.updatedAt
          ? new Date(a.item.updatedAt).getTime()
          : 0;
        const dateB = b.item.updatedAt
          ? new Date(b.item.updatedAt).getTime()
          : 0;
        return dateB - dateA;
      });

      // Filter out unique projects, keeping only the most recently updated ones
      const uniqueProjects = projects.filter(
        (project, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.item.name === project.item.name &&
              t.item.owner?.login === project.item.owner?.login,
          ),
      );

      // Delete all projects from the database
      await this.projectModel.deleteMany({}).exec();

      // Insert unique projects back into the database
      await this.projectModel.insertMany(uniqueProjects);

      console.log('Deleted duplicate projects and reinserted unique ones.');
    } catch (error) {
      console.error('Error deleting duplicate projects:', error);
    }
  }
}
