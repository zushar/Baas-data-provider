import { z } from 'zod';

// Step 1: Schema and Types
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

type GithubContributorStats = z.infer<typeof gitHubContributorStatsSchema>;

export type Analytics = {
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
  since: number;
  until: number;
  stat: 'allTimes' | 'lastMonth' | 'lastWeek';
};

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

const fetchRepoData = async (owner: string, repo: string) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/stats/contributors`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data for ${owner}/${repo}, ${response.status} 
      ${response.statusText}, ${await response.text()}`,
    );
  }
  // This log is for debugging purposes only
  console.log(
    `Fetcht data for ${owner}/${repo} with status ${response.status}`,
  );
  if (response.status === 202) {
    console.log('Retrying in 30 seconds');
    await new Promise((resolve) => setTimeout(resolve, 30000));
    return fetchRepoData(owner, repo);
  }
  const json = await response.json();
  return { owner, repo, json };
};

// Step 3: Error Handling and Data Processing
const processRepoDataAllTimes = (
  data: { owner: string; repo: string; json: GithubContributorStats },
  acc: Map<string, Analytics['members'][number]>,
): Map<string, Analytics['members'][number]> => {
  data.json.forEach((contributor) => {
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
        projects_names: existing.projects_names.concat(member.projects_names),
      });
    }
  });

  return acc;
};

const processRepoDataWeekly = (
  data: { owner: string; repo: string; json: GithubContributorStats },
  acc: Map<string, Analytics['members'][number]>,
): Map<string, Analytics['members'][number]> => {
  data.json.forEach((contributor) => {
    const { author, weeks } = contributor;
    const { score, stats } = calculateTotals(weeks.slice(-1));

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
        projects_names: existing.projects_names.concat(member.projects_names),
      });
    }
  });

  return acc;
};

const processRepoDataMonthly = (
  data: { owner: string; repo: string; json: GithubContributorStats },
  acc: Map<string, Analytics['members'][number]>,
): Map<string, Analytics['members'][number]> => {
  data.json.forEach((contributor) => {
    const { author, weeks } = contributor;
    const { score, stats } = calculateTotals(weeks.slice(-4));

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
    score: (m.score / maxScore) * 100, // Normalize the score to a percentage so it's easier to compare
  }));
};

const fetchAndThrottle = async (repos: { owner: string; repo: string }[]) => {
  const results = await Promise.allSettled(
    repos.map(
      ({ owner, repo }) =>
        fetchRepoData(owner, repo) as unknown as ReturnType<
          typeof fetchRepoData
        >,
    ),
  );

  return results;
};

const sortLeaderboard = (members: Analytics['members']) =>
  members.sort((a, b) => b.score - a.score);

// Step 5: Implementing the Builder Pattern
class LeaderboardBuilder {
  private leaderboard: Map<string, Analytics['members'][number]> = new Map();
  private leaderboardWeekly: Map<string, Analytics['members'][number]> =
    new Map();
  private leaderboardMonthly: Map<string, Analytics['members'][number]> =
    new Map();

  private allTimes = { since: 0, until: 0 };
  private monthly = { since: 0, until: 0 };
  private weekly = { since: 0, until: 0 };

  async processRepos(repos: { owner: string; repo: string }[]) {
    const results = await fetchAndThrottle(repos);

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const parsedData = gitHubContributorStatsSchema.safeParse(
          result.value.json,
        );
        if (!parsedData.success) return;
        const value = {
          owner: result.value.owner,
          repo: result.value.repo,
          json: parsedData.data,
        };
        this.leaderboard = processRepoDataAllTimes(value, this.leaderboard);
        this.leaderboardWeekly = processRepoDataWeekly(
          value,
          this.leaderboardWeekly,
        );
        this.leaderboardMonthly = processRepoDataMonthly(
          value,
          this.leaderboardMonthly,
        );

        const times = parsedData.data.flatMap((d) => d.weeks.map((w) => w.w));
        if (times.length === 0) return;
        times.sort((a, b) => b - a); // sort in descending order to get the most recent date first
        this.allTimes.since = times.at(-1)!;
        this.allTimes.until = times.at(0)!;
        this.monthly.since = times.at(4)!;
        this.monthly.until = times.at(0)!;
        this.weekly.since = times.at(1)!;
        this.weekly.until = times.at(0)!;
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
    const arrayLeaderboardWeekly = normalizeScores(
      Array.from(this.leaderboardWeekly.values()),
    );
    const arrayLeaderboardMonthly = normalizeScores(
      Array.from(this.leaderboardMonthly.values()),
    );
    return [
      sortLeaderboard(arrayLeaderboard),
      sortLeaderboard(arrayLeaderboardWeekly),
      sortLeaderboard(arrayLeaderboardMonthly),
    ];
  }

  build(): Analytics[] {
    const [sortedLeaderboard, arrayLeaderboardWeekly, arrayLeaderboardMonthly] =
      this.normalizeAndSort(); // all times leaderboard

    return [
      {
        members: sortedLeaderboard,
        since: this.allTimes.since,
        until: this.allTimes.until,
        stat: 'allTimes',
      },
      {
        members: arrayLeaderboardMonthly,
        since: this.monthly.since,
        until: this.monthly.until,
        stat: 'lastMonth',
      },
      {
        members: arrayLeaderboardWeekly,
        since: this.weekly.since,
        until: this.weekly.until,
        stat: 'lastWeek',
      },
    ];
  }

  proccessTimes(result: { w: number }[]) {
    return {
      since: Math.min(...result.map((r) => r.w)) * 1000,
      until: Math.max(...result.map((r) => r.w)) * 1000,
    };
  }
}

// Step 6: Functional Programming and Final Function
interface Repo {
  owner: string;
  repo: string;
}

async function getLeaderboardDataFromGithub(
  repos: Repo[],
): Promise<Analytics[]> {
  const builder = new LeaderboardBuilder();
  await builder.processRepos(repos);
  return builder.build();
}

export default getLeaderboardDataFromGithub;
