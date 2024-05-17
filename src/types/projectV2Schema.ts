import { z } from 'zod';

const OwnerSchema = z.object({
  id: z.string().nullable().optional(),
  login: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

const LanguageNodeSchema = z.object({
  name: z.string().nullable().optional(),
});

const LanguageEdgeSchema = z.object({
  node: LanguageNodeSchema,
});

const LanguagesSchema = z.object({
  edges: z.array(LanguageEdgeSchema).nullable().optional(),
});

const ContributorNodeSchema = z.object({
  avatarUrl: z.string().nullable().optional(),
  login: z.string().nullable().optional(),
});

const ContributorEdgeSchema = z.object({
  node: ContributorNodeSchema,
});

const ContributorsSchema = z.object({
  edges: z.array(ContributorEdgeSchema).nullable().optional(),
});

const RepositorySchema = z.object({
  name: z.string().nullable().optional(),
  owner: OwnerSchema.nullable().optional(),
  openGraphImageUrl: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  stargazerCount: z.number().nullable().optional(),
  languages: LanguagesSchema.nullable().optional(),
  collaborators: z
    .object({
      totalCount: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
  contributors: ContributorsSchema.nullable().optional(),
});

const DataSchema = z.object({
  repository: RepositorySchema.nullable().optional(),
});

const GraphQLErrorSchema = z.object({
  type: z.string().nullable().optional(),
  path: z.array(z.string()).nullable().optional(),
  extensions: z
    .object({
      saml_failure: z.boolean().nullable().optional(),
    })
    .nullable()
    .optional(),
  locations: z
    .array(
      z.object({
        line: z.number().nullable().optional(),
        column: z.number().nullable().optional(),
      }),
    )
    .nullable()
    .optional(),
  message: z.string().nullable().optional(),
});

const ErrorSchema = z.object({
  name: z.string().nullable().optional(),
  graphQLErrors: z.array(GraphQLErrorSchema).nullable().optional(),
  networkError: z.any().nullable().optional(),
  response: z.object({}).nullable().optional(),
});

const ContextSchema = z.object({
  url: z.string().nullable().optional(),
  requestPolicy: z.string().nullable().optional(),
  suspense: z.boolean().nullable().optional(),
});

const OperationSchema = z.object({
  key: z.number().nullable().optional(),
  query: z
    .object({
      kind: z.string().nullable().optional(),
      definitions: z
        .array(
          z.object({
            kind: z.string().nullable().optional(),
            operation: z.string().nullable().optional(),
            name: z
              .object({
                kind: z.string().nullable().optional(),
                value: z.string().nullable().optional(),
              })
              .nullable()
              .optional(),
            variableDefinitions: z
              .array(
                z.object({
                  kind: z.string().nullable().optional(),
                  variable: z
                    .object({
                      kind: z.string().nullable().optional(),
                      name: z
                        .object({
                          kind: z.string().nullable().optional(),
                          value: z.string().nullable().optional(),
                        })
                        .nullable()
                        .optional(),
                    })
                    .nullable()
                    .optional(),
                  type: z
                    .object({
                      kind: z.string().nullable().optional(),
                      type: z
                        .object({
                          kind: z.string().nullable().optional(),
                          name: z
                            .object({
                              kind: z.string().nullable().optional(),
                              value: z.string().nullable().optional(),
                            })
                            .nullable()
                            .optional(),
                        })
                        .nullable()
                        .optional(),
                    })
                    .nullable()
                    .optional(),
                  directives: z.array(z.any()).nullable().optional(),
                }),
              )
              .nullable()
              .optional(),
            directives: z.array(z.any()).nullable().optional(),
            selectionSet: z
              .object({
                kind: z.string().nullable().optional(),
                selections: z
                  .array(
                    z.object({
                      kind: z.string().nullable().optional(),
                      name: z
                        .object({
                          kind: z.string().nullable().optional(),
                          value: z.string().nullable().optional(),
                        })
                        .nullable()
                        .optional(),
                      arguments: z
                        .array(
                          z.object({
                            kind: z.string().nullable().optional(),
                            name: z
                              .object({
                                kind: z.string().nullable().optional(),
                                value: z.string().nullable().optional(),
                              })
                              .nullable()
                              .optional(),
                            value: z
                              .object({
                                kind: z.string().nullable().optional(),
                                name: z
                                  .object({
                                    kind: z.string().nullable().optional(),
                                    value: z.string().nullable().optional(),
                                  })
                                  .nullable()
                                  .optional(),
                              })
                              .nullable()
                              .optional(),
                          }),
                        )
                        .nullable()
                        .optional(),
                      directives: z.array(z.any()).nullable().optional(),
                      selectionSet: z
                        .object({
                          kind: z.string().nullable().optional(),
                          selections: z
                            .array(
                              z.object({
                                kind: z.string().nullable().optional(),
                                name: z
                                  .object({
                                    kind: z.string().nullable().optional(),
                                    value: z.string().nullable().optional(),
                                  })
                                  .nullable()
                                  .optional(),
                                arguments: z
                                  .array(z.any())
                                  .nullable()
                                  .optional(),
                                directives: z
                                  .array(z.any())
                                  .nullable()
                                  .optional(),
                                selectionSet: z
                                  .object({
                                    kind: z.string().nullable().optional(),
                                    selections: z
                                      .array(
                                        z.object({
                                          kind: z
                                            .string()
                                            .nullable()
                                            .optional(),
                                          name: z
                                            .object({
                                              kind: z
                                                .string()
                                                .nullable()
                                                .optional(),
                                              value: z
                                                .string()
                                                .nullable()
                                                .optional(),
                                            })
                                            .nullable()
                                            .optional(),
                                          arguments: z
                                            .array(z.any())
                                            .nullable()
                                            .optional(),
                                          directives: z
                                            .array(z.any())
                                            .nullable()
                                            .optional(),
                                          selectionSet: z
                                            .object({
                                              kind: z
                                                .string()
                                                .nullable()
                                                .optional(),
                                              selections: z
                                                .array(
                                                  z.object({
                                                    kind: z
                                                      .string()
                                                      .nullable()
                                                      .optional(),
                                                    name: z
                                                      .object({
                                                        kind: z
                                                          .string()
                                                          .nullable()
                                                          .optional(),
                                                        value: z
                                                          .string()
                                                          .nullable()
                                                          .optional(),
                                                      })
                                                      .nullable()
                                                      .optional(),
                                                    arguments: z
                                                      .array(z.any())
                                                      .nullable()
                                                      .optional(),
                                                    directives: z
                                                      .array(z.any())
                                                      .nullable()
                                                      .optional(),
                                                  }),
                                                )
                                                .nullable()
                                                .optional(),
                                            })
                                            .nullable()
                                            .optional(),
                                        }),
                                      )
                                      .nullable()
                                      .optional(),
                                  })
                                  .nullable()
                                  .optional(),
                              }),
                            )
                            .nullable()
                            .optional(),
                        })
                        .nullable()
                        .optional(),
                    }),
                  )
                  .nullable()
                  .optional(),
              })
              .nullable()
              .optional(),
          }),
        )
        .nullable()
        .optional(),
      loc: z
        .object({
          start: z.number().nullable().optional(),
          end: z.number().nullable().optional(),
          source: z
            .object({
              body: z.string().nullable().optional(),
              name: z.string().nullable().optional(),
              locationOffset: z
                .object({
                  line: z.number().nullable().optional(),
                  column: z.number().nullable().optional(),
                })
                .nullable()
                .optional(),
            })
            .nullable()
            .optional(),
        })
        .nullable()
        .optional(),
      __key: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
  variables: z
    .object({
      owner: z.string().nullable().optional(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  kind: z.string().nullable().optional(),
  context: ContextSchema.nullable().optional(),
});

const ItemSchema = z.object({
  operation: OperationSchema.nullable().optional(),
  data: DataSchema.nullable().optional(),
  error: ErrorSchema.nullable().optional(),
  hasNext: z.boolean().nullable().optional(),
  stale: z.boolean().nullable().optional(),
});

const GitHubResponseSchema = z.object({
  timestamp: z
    .object({
      $date: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  item: ItemSchema.nullable().optional(),
  error: z.any().nullable().optional(),
  meta: z
    .object({
      link: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  __v: z.number().nullable().optional(),
});

export default GitHubResponseSchema;

// Above is the schema for the projectV2Schema.ts file. The schema is generated
// Below is the new schema for the database

// Define the summary schema
const SummarySchema = z.object({
  timestamp: z.string(),
  repository: z.object({
    name: z.string().nullable(),
    owner: z
      .object({
        id: z.string().nullable(),
        login: z.string().nullable(),
        avatarUrl: z.string().nullable(),
      })
      .nullable(),
    description: z.string().nullable(),
    url: z.string().nullable(),
    stargazerCount: z.number().nullable(),
    languages: z.array(z.string().nullable()).nullable(),
    contributors: z
      .array(
        z
          .object({
            login: z.string().nullable(),
            avatarUrl: z.string().nullable(),
          })
          .nullable(),
      )
      .nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
  }),
  errorsData: z
    .array(
      z
        .object({
          type: z.string().nullable(),
          message: z.string().nullable(),
        })
        .nullable(),
    )
    .nullable(),
});

// Infer the TypeScript type from the summary schema
export type SummaryProjectType = z.infer<typeof SummarySchema>;

export function summarizeGitHubData(
  data: z.infer<typeof GitHubResponseSchema>[],
): SummaryProjectType[] {
  return data.map((item) => ({
    timestamp: item.timestamp?.$date ?? 'N/A',
    repository: {
      name: item.item?.data?.repository?.name ?? null,
      owner: item.item?.data?.repository?.owner
        ? {
            id: item.item?.data?.repository?.owner.id ?? null,
            login: item.item?.data?.repository?.owner.login ?? null,
            avatarUrl: item.item?.data?.repository?.owner.avatarUrl ?? null,
          }
        : null,
      description: item.item?.data?.repository?.description ?? null,
      url: item.item?.data?.repository?.url ?? null,
      stargazerCount: item.item?.data?.repository?.stargazerCount ?? null,
      languages: item.item?.data?.repository?.languages?.edges
        ? item.item?.data?.repository?.languages.edges.map(
            (edge) => edge.node?.name ?? null,
          )
        : null,
      contributors: item.item?.data?.repository?.contributors?.edges
        ? item.item?.data?.repository?.contributors.edges.map((edge) => ({
            login: edge.node?.login ?? null,
            avatarUrl: edge.node?.avatarUrl ?? null,
          }))
        : null,
      createdAt: item.item?.data?.repository?.createdAt ?? null,
      updatedAt: item.item?.data?.repository?.updatedAt ?? null,
    },
    errorsData: item.item?.error?.graphQLErrors
      ? item.item?.error?.graphQLErrors.map((error) => ({
          type: error.type ?? null,
          message: error.message ?? null,
        }))
      : [],
  }));
}
