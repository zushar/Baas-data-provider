export interface IGQLProjectResponse {
  data: IProjectData;
}

export interface IProjectData {
  repository: IRepository;
}

export interface IRepository {
  name: string;
  owner: ProjectOwner;
  openGraphImageUrl: string;
  description: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  stargazerCount: number;
  languages: ILanguages;
  collaborators: ICollaborators;
  contributors: IContributors;
}

export interface ProjectOwner {
  id: string;
  login: string;
  avatarUrl: string;
}

export interface ICollaborators {
  totalCount: number;
}

export interface IContributors {
  edges: IContributorsEdge[];
}

export interface IContributorsEdge {
  node: IPurpleNode;
}

export interface IPurpleNode {
  avatarUrl: string;
  login: string;
}

export interface ILanguages {
  edges: ILanguagesEdge[];
}

export interface ILanguagesEdge {
  node: ILanguageNode;
}

export interface ILanguageNode {
  name: string;
}

export enum ProjectPaginationFilter {
  ALL = 'all',
  RECENTLY_UPDATED = 'recently_updated',
  MOST_CONTROBUTORS = 'most_contributors',
  RECENTLY_CREATED = 'recently_created',
}

export interface ProjectPaginationRequest {
  page: number;
  limit: number;
  timestamp?: Date;
  filter: ProjectPaginationFilter;
}
