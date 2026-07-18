import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getCurrentUserAction } from "@/app/actions/user";
import { TRPCError } from "@trpc/server";
import { getCommitHashes, getCommitDiff } from "@/lib/github";
import { summarizeCommit } from "@/lib/gemini";
import { indexGithubRepo } from "@/lib/github-loader";



export const projectRouter = createTRPCRouter({
  createProject: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        githubUrl: z.string().url("Must be a valid URL"),
        githubToken: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUserAction();

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a project",
        });
      }

      const userId = user.id;
      console.log("Found userId inside tRPC:", userId);

      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          githubUrl: input.githubUrl,
          userId: userId,
        },
      });

      try {
        await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
      } catch (error) {
        console.error("Failed to index github repo:", error);
      }

      return project;
    }),

  getProjects: publicProcedure.query(async ({ ctx }) => {
    const user = await getCurrentUserAction();

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view projects",
      });
    }

    return ctx.db.project.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getCommits: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        cursor: z.string().nullish(), // commit ID for cursor-based pagination
      })
    )
    .query(async ({ ctx, input }) => {
      const LIMIT = 5;
      const user = await getCurrentUserAction();

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view commits",
        });
      }

      const project = await ctx.db.project.findUnique({
        where: { id: input.projectId },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      // Fetch latest commits from GitHub and sync to DB
      const githubCommits = await getCommitHashes(project.githubUrl);

      // Get existing commit hashes for this project from DB
      const existingCommits = await ctx.db.commit.findMany({
        where: { projectId: input.projectId },
        select: { commitHash: true },
      });
      const existingHashes = new Set(existingCommits.map((c) => c.commitHash));

      // Filter to only new commits
      const newCommits = githubCommits.filter(
        (c) => !existingHashes.has(c.commitHash)
      );

      // Insert new commits into DB
      if (newCommits.length > 0) {
        await ctx.db.commit.createMany({
          data: newCommits.map((c) => ({
            projectId: input.projectId,
            commitMessage: c.commitMessage,
            commitHash: c.commitHash,
            commitAuthorName: c.commitAuthorName,
            commitAuthorAvatar: c.commitAuthorAvatar,
            commitDate: new Date(c.commitDate),
          })),
        });
      }

      // Return paginated commits from DB, sorted newest first
      const commits = await ctx.db.commit.findMany({
        where: { projectId: input.projectId },
        orderBy: { commitDate: "desc" },
        take: LIMIT + 1, // fetch one extra to determine if there's a next page
        ...(input.cursor
          ? { cursor: { id: input.cursor }, skip: 1 } // skip the cursor item itself
          : {}),
      });

      let nextCursor: string | undefined = undefined;
      if (commits.length > LIMIT) {
        const nextItem = commits.pop(); // remove the extra item
        nextCursor = nextItem!.id;
      }

      // Generate summaries for commits in this page that don't have one yet
      await Promise.all(
        commits.map(async (commit) => {
          if (!commit.summary) {
            try {
              const diff = await getCommitDiff(project.githubUrl, commit.commitHash);
              const summary = await summarizeCommit(diff);
              await ctx.db.commit.update({
                where: { id: commit.id },
                data: { summary },
              });
              commit.summary = summary;
            } catch (err) {
              console.error(`Failed to summarize commit ${commit.commitHash}:`, err);
            }
          }
        })
      );

      return {
        commits,
        nextCursor,
      };
    }),
});