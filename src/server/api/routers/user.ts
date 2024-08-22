import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { userTable } from "@/server/db/schema";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createUser: publicProcedure
    .input(
      z.object({ id: z.string(), githubId: z.number(), username: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(userTable).values({
        id: input.id,
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
