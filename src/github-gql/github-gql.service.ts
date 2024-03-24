import { Injectable } from '@nestjs/common';
import {
  AnyVariables,
  Client,
  TypedDocumentNode,
  // cacheExchange, // TODO: determine later if caching is needed in this context
} from '@urql/core';

@Injectable()
export class GithubGqlService {
  constructor(
    private readonly client: Client, // Inject URQL Client
  ) {}

  async query(query: TypedDocumentNode, variables: AnyVariables) {
    return this.client
      .query(query, variables as { [key: string]: never })
      .toPromise();
  }
}
