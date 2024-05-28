import { SummaryProjectType } from '@/types/projectV2Schema';

export default function makeMockProject(
  name: string,
  ownerLogin: string,
  languages: string[],
  createdAt?: Date,
  updatedAt?: Date,
): SummaryProjectType {
  createdAt = createdAt || new Date();
  updatedAt = updatedAt || new Date();

  const project: SummaryProjectType = {
    timestamp: new Date().toISOString(),
    repository: {
      name: name,
      owner: {
        login: ownerLogin,
        avatarUrl: `https://avatars.githubusercontent.com/u/17686879?v=4`,
        id: '1',
      },
      description: null,
      url: null,
      stargazerCount: null,
      languages: languages.length ? languages : null,
      contributors: [
        {
          avatarUrl: 'https://avatars.githubusercontent.com/u/17686879?v=4',
          login: ownerLogin,
        },
      ] as ({ login: string | null; avatarUrl: string | null } | null)[] | null,
      createdAt: createdAt,
      updatedAt: updatedAt,
    },
    errorsData: null,
  };
  return project;
}
