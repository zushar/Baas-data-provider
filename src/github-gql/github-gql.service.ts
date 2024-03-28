import { Injectable } from '@nestjs/common';
import {
  AnyVariables,
  Client,
  TypedDocumentNode,
  // cacheExchange, // TODO: determine later if caching is needed in this context
} from '@urql/core';
import * as projectJsons from '@/../jsons/projects.json';
import * as memberJsons from '@/../jsons/members.json';
import { IGQLProjectResponse } from '@/types/project';
import { queryProjectDetails } from './queries/projects';
import { IGithubGQLResponse } from '@/types';
import { queryMember } from './queries/member';
import { IGQLMembersResponse } from '@/types/member';

@Injectable()
export class GithubGqlService {
  constructor(
    private readonly client: Client, // Inject URQL Client
  ) {}

  private query<T>(query: TypedDocumentNode, variables: AnyVariables) {
    return this.client
      .query(query, variables as { [key: string]: never })
      .toPromise() as Promise<T>;
  }

  async getProjects(): Promise<IGithubGQLResponse<IGQLProjectResponse>[]> {
    const repoLinks = projectJsons.map((project) => project.githubLink);

    if (!repoLinks?.length) {
      throw new Error('No projects found');
    }

    const requests = repoLinks.map((link) => {
      const [owner, name] = link.replace('https://github.com/', '').split('/');
      return this.query<IGQLProjectResponse>(queryProjectDetails, {
        owner,
        name,
      })
        .then((data) => ({ item: data, error: null, meta: { link } }))
        .catch((error) => ({ item: null, error, meta: { link } }));
    });

    const results = await Promise.all(requests);
    return results;
  }

  async getMembers() {
    const requests = memberJsons.map((member) => {
      const login = member.links.github.replace('https://github.com/', '');

      return this.query<IGQLMembersResponse>(queryMember, { login })
        .then((data) => ({
          item: data,
          error: null,
          meta: { ...member },
        }))
        .catch((error) => ({ item: null, error, meta: { ...member } }));
    });

    const results = await Promise.all(requests);
    return results;
  }
}
