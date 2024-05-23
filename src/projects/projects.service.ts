import {
  Language,
  LanguageDocument,
} from '@/common/mongoose/schemas/languages';
import { Project, ProjectDocument } from '@/common/mongoose/schemas/project';
import {
  ProjectDocumentV2,
  ProjectV2,
} from '@/common/mongoose/schemas/projectV2';
import { GithubGqlService } from '@/github-gql/github-gql.service';
import { IGithubGQLResponse } from '@/types';
import {
  IGQLProjectResponse,
  ProjectPaginationFilter,
  ProjectPaginationRequest,
} from '@/types/project';
import GitHubResponseSchema, {
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
    @InjectModel(ProjectV2.name)
    private readonly projectModelV2: Model<ProjectDocumentV2>,
    @InjectModel(Language.name)
    private readonly languageModel: Model<LanguageDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.handleCron();
    await this.handleCronDelete();
  }

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async handleCron() {
    await this.saveProjects();
    await this.deleteAllProjectsV2();
    await this.saveProjectsV2();
  }
  // TODO: Implement a logic to delete old projects just after getting new ones seccessfully
  @Cron(CronExpression.EVERY_WEEK)
  async handleCronDelete() {
    await this.deleteOldProjects();
    await this.saveProjects();
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

  // This function deletes old projects
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

    // get total count of projects
    const totalProjects = await this.projectModel
      .countDocuments({ timestamp: languages.timestamp })
      .exec();

    return {
      projects,
      total: totalProjects,
      languages: languages.languages,
      pageLanguages: this.buildLanguageUniqueArray(projects),
      timestamp: languages.timestamp,
    };
  }

  async getPaginatedProjects({
    page,
    limit,
    timestamp,
    filter,
  }: ProjectPaginationRequest): Promise<ProjectDocument[]> {
    // Handle MOST_CONTRIBUTORS filter with aggregation
    if (filter === ProjectPaginationFilter.MOST_CONTROBUTORS) {
      const aggregationPipeline: PipelineStage[] = [
        // Match stage to filter documents based on the provided timestamp
        { $match: { timestamp: { $eq: timestamp } } },
        // Project the size of the contributors.edges array to a new field
        {
          $addFields: {
            contributorsCount: {
              $size: '$item.data.repository.contributors.edges',
            },
          },
        },
        // Sort by the newly added contributorsCount field
        { $sort: { contributorsCount: -1 } },
        // Apply pagination
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ];

      // Execute the aggregation pipeline for the MOST_CONTRIBUTORS filter
      return await this.projectModel.aggregate(aggregationPipeline).exec();
    } else {
      // Handle other filters with simple query
      let sortCriteria = {};
      switch (filter) {
        case ProjectPaginationFilter.RECENTLY_UPDATED:
          sortCriteria = { 'item.data.repository.updatedAt': -1 };
          break;
        case ProjectPaginationFilter.RECENTLY_CREATED:
          sortCriteria = { 'item.data.repository.createdAt': -1 };
          break;
        case ProjectPaginationFilter.ALL:
        default:
          sortCriteria = { createdAt: -1 }; // Default sorting
          break;
      }

      // Execute a find query for filters other than MOST_CONTRIBUTORS
      return await this.projectModel
        .find(timestamp ? { timestamp: { $eq: timestamp } } : {})
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

    const languages = this.buildLanguageUniqueArray(projectData);

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

  private async saveProjectToDb(project, timestamp) {
    try {
      const newProjectDocument = new this.projectModel({
        timestamp,
        item: project.item,
        error: project.error,
        meta: { link: project.meta?.link },
      });

      await newProjectDocument.save();
    } catch (error) {
      Logger.error(error);
    }
  }

  private buildLanguageUniqueArray(
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

  // ******* V2 ********
  async saveProjectsV2() {
    const { projectData, languages, timestamp } =
      await this.getProjectsFromGithub();
    try {
      await this.saveLanguageToDb(languages, timestamp);

      await Promise.all(
        projectData.map((project) => this.saveProjectToDbV2(project)),
      );
    } catch (error) {
      Logger.error('Error saving data', error);
    }
  }
  async getAllProjectsV2() {
    return await this.projectModelV2.find({}).exec();
  }
  private async deleteAllProjectsV2() {
    return await this.projectModelV2.deleteMany().exec();
  }
  private async saveProjectToDbV2(project) {
    try {
      const newProjectDocument = new this.projectModelV2(project);

      await newProjectDocument.save();
    } catch (error) {
      Logger.error(error);
    }
  }
}
