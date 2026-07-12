import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getCurrentUserAction } from "@/app/actions/user";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  createProject: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        githubUrl: z.string().url("Must be a valid URL"),
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

      return ctx.db.project.create({
        data: {
          name: input.name,
          githubUrl: input.githubUrl,
          userId: userId,
        },
      });
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
});