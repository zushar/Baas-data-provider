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
