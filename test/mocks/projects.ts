import { ProjectDBItemType } from '@/types/projectV2Schema';

export default function makeMockProject(
  name: string,
  ownerLogin: string,
  languages: string[],
  createdAt?: Date,
  updatedAt?: Date,
): ProjectDBItemType {
  createdAt = createdAt || new Date();
  updatedAt = updatedAt || new Date();

  const project: ProjectDBItemType = {
    timestamp: new Date(),
    errorsData: null,
    meta: { link: '' },
    item: {
      name: name,
      owner: {
        login: ownerLogin,
        avatarUrl: `https://avatars.githubusercontent.com/u/24523?u=44ee2cafc2109ac11f98f78313a97556eaff972b&v=4`,
        id: '1',
      },
      description: null,
      url: 'https://github.com/keephq/keep',
      stargazerCount: 0,
      languages: languages.length ? languages : [],
      contributors: [
        {
          avatarUrl:
            'https://avatars.githubusercontent.com/u/24523?u=44ee2cafc2109ac11f98f78313a97556eaff972b&v=4',
          login: ownerLogin,
        },
      ],
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    },
  };
  return project;
}
