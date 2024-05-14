type LeaderboardTypeMember = {
  name: string;
  node_id: string;
  projects_names: LeaderboardTypeProjectName[];
  avatar_url: string;
  score: number;
  stats: LeaderboardTypeMemberStats;
};

type LeaderboardTypeProjectName = {
  url: string;
  name: string;
};

type LeaderboardTypeMemberStats = {
  additions: number;
  deletions: number;
  commits: number;
};

export type LeaderboardTypeAnalytics = {
  members: LeaderboardTypeMember[];
  since: string;
  until: string;
};
