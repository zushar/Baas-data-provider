import * as z from 'zod';

const LeaderboardProjectNameSchema = z.object({
  url: z.string(),
  name: z.string(),
});

const LeaderboardMemberStatsSchema = z.object({
  additions: z.number(),
  deletions: z.number(),
  commits: z.number(),
});

const LeaderboardMemberSchema = z.object({
  name: z.string(),
  node_id: z.string(),
  projects_names: z.array(LeaderboardProjectNameSchema),
  avatar_url: z.string(),
  score: z.number(),
  stats: LeaderboardMemberStatsSchema,
});

export const LeaderboardAnalyticsSchema = z.object({
  members: z.array(LeaderboardMemberSchema),
  since: z.number(),
  until: z.number(),
});

export type LeaderboardTypeAnalytics = z.infer<
  typeof LeaderboardAnalyticsSchema
>;
