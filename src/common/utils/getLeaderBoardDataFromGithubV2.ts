import { z } from 'zod';

// Step 1: Schema and Types Optimization
const githubWeekStatesSchema = z.object({
  w: z.number(),
  a: z.number(),
  d: z.number(),
  c: z.number(),
});

const gitHubauthorSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string(),
  avatar_url: z.string(),
});

const gitHubContributorStatsSchema = z.array(
  z.object({
    total: z.number(),
    weeks: z.array(githubWeekStatesSchema),
    author: gitHubauthorSchema,
  }),
);

type Analytics = {
  members: {
    name: string;
    node_id: string;
    projects_names: {
      url: string;
      name: string;
    }[];
    avatar_url: string;
    score: number;
    stats: {
      additions: number;
      deletions: number;
      commits: number;
    };
  }[];
  since: string;
  until: string;
};

type GithubContributorStats = z.infer<typeof gitHubContributorStatsSchema>;

// Step 2: Helper Functions
const calculateTotals = (weeks: GithubContributorStats[number]['weeks']) =>
  weeks.reduce(
    (acc, week) => {
      const stats = {
        additions: week.a + acc.stats.additions,
        deletions: week.d + acc.stats.deletions,
        commits: week.c + acc.stats.commits,
      };
      return {
        score:
          acc.score +
          (stats.additions * 3 + stats.deletions * 2 + stats.commits),
        stats,
      };
    },
    { score: 0, stats: { additions: 0, deletions: 0, commits: 0 } },
  );

const fetchRepoData = async (
  owner: string,
  repo: string,
  since: string,
  until: string,
) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/stats/contributors?order=desc&until=${until}&since=${since}`;
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch data for ${owner}/${repo}`);
  const json = await response.json();
  return { owner, repo, json };
};

// Step 3: Error Handling and Data Processing
const processRepoData = (
  data: { owner: string; repo: string; json: unknown },
  acc: Map<string, Analytics['members'][number]>,
): Map<string, Analytics['members'][number]> => {
  const parsedData = gitHubContributorStatsSchema.safeParse(data.json);
  if (!parsedData.success) return acc;

  parsedData.data.forEach((contributor) => {
    const { author, weeks } = contributor;
    const { score, stats } = calculateTotals(weeks);

    const member = {
      name: author.login,
      node_id: author.node_id,
      projects_names: [{ url: `${data.owner}/${data.repo}`, name: data.repo }],
      avatar_url: author.avatar_url,
      score,
      stats,
    };

    if (!acc.has(member.node_id)) {
      acc.set(member.node_id, member);
    } else {
      const existing = acc.get(member.node_id)!;
      acc.set(member.node_id, {
        ...existing,
        score: existing.score + member.score,
        stats: {
          additions: existing.stats.additions + member.stats.additions,
          deletions: existing.stats.deletions + member.stats.deletions,
          commits: existing.stats.commits + member.stats.commits,
        },
        projects_names: [...existing.projects_names, ...member.projects_names],
      });
    }
  });

  return acc;
};

// Step 4: Optimization and Leaderboard Construction
const normalizeScores = (members: Analytics['members']) => {
  const maxScore = Math.max(...members.map((m) => m.score));
  return members.map((m) => ({
    ...m,
    score: (m.score / maxScore) * 100,
  }));
};

const sortLeaderboard = (members: Analytics['members']) =>
  members.sort((a, b) => b.score - a.score);

// Step 6: Implementing the Builder Pattern
class LeaderboardBuilder {
  private leaderboard: Map<string, Analytics['members'][number]> = new Map();

  async fetchAndProcessRepos(
    repos: { owner: string; repo: string }[],
    since: string,
    until: string,
  ) {
    const results = await Promise.allSettled(
      repos.map(({ owner, repo }) => fetchRepoData(owner, repo, since, until)),
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        this.leaderboard = processRepoData(result.value, this.leaderboard);
      } else {
        console.error('Error fetching data:', result.reason);
      }
    });

    return this;
  }

  normalizeAndSort() {
    const arrayLeaderboard = normalizeScores(
      Array.from(this.leaderboard.values()),
    );
    return sortLeaderboard(arrayLeaderboard);
  }

  build(
    since: string,
    until: string,
  ): { members: Analytics['members']; since: string; until: string } {
    const sortedLeaderboard = this.normalizeAndSort();
    return { members: sortedLeaderboard, since, until };
  }
}

// Step 5: Functional Programming and Final Function
async function getLeaderboardDataFromGithub(): Promise<{
  members: Analytics['members'];
  since: string;
  until: string;
}> {
  // Calculate the dynamic 'since' and 'until' dates
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const until = new Date().toISOString();

  const repos = [
    { owner: 'maakaf', repo: 'maakaf-website' },
    { owner: 'maakaf', repo: 'Baas-data-provider' },
  ];

  const builder = new LeaderboardBuilder();
  await builder.fetchAndProcessRepos(repos, since, until);
  return builder.build(since, until);
}

export default getLeaderboardDataFromGithub;
