import { IGQLProjectResponse, ILanguagesEdge } from '@/types/project';

function makeLanguages(languages: string[]): ILanguagesEdge[] {
  return languages.map((language) => ({
    node: {
      name: language,
    },
  }));
}

export default function makeMockProject(
  name: string,
  ownerLogin: string,
  languages: string[],
): IGQLProjectResponse {
  return {
    data: {
      repository: {
        name,
        owner: {
          id: 'MDQ6VXNlcjEyNDMzNDQx',
          login: ownerLogin,
          avatarUrl:
            'https://avatars.githubusercontent.com/u/12433441?u=85665f35541af9ada1b72952cf2a5930f7d666c3&v=4',
        },
        openGraphImageUrl:
          'https://opengraph.githubassets.com/4a4e9cd0837e21a78c49c2fd8a64ee88f9290f4a5954c88debbe8701b078f051/Darkmift/open-bus-map-search',
        description: 'open-bus-map-search',
        url: 'https://github.com/Darkmift/open-bus-map-search',
        createdAt: new Date(),
        updatedAt: new Date(),
        stargazerCount: 0,
        languages: {
          edges: makeLanguages(languages),
        },
        collaborators: {
          totalCount: 1,
        },
        contributors: {
          edges: [
            {
              node: {
                avatarUrl:
                  'https://avatars.githubusercontent.com/u/12433441?u=85665f35541af9ada1b72952cf2a5930f7d666c3&v=4',
                login: 'Darkmift',
              },
            },
          ],
        },
      },
    },
  };
}
