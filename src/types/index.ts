export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

export interface IGithubGQLResponse<T> {
  item: T | null;
  error: Error | null;
  meta?: {
    [key: string]: unknown;
  };
}
