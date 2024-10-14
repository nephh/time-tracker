import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { userTable } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
        githubId: z.string(),
        googleId: z.string(),
        username: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(userTable).values({
        id: input.id,
        googleId: input.googleId,
        githubId: input.githubId,
        username: input.username,
      });
    }),

  // getUser: publicProcedure.query(async ({ ctx, input }) => {
  //   const { user } = await validateRequest();
  //   if (!user) {
  //     throw new TRPCError({
  //       message: "User not found",
  //       code: "BAD_REQUEST",
  //     });
  //   }

  //   const currentUser = await ctx.db.query.userTable.findFirst({
  //     where: (model, { eq }) => eq(model.id, user.id),
  //   });

  //   return currentUser ?? null;
  // }),
});
