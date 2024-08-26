import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { timerTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const timerRouter = createTRPCRouter({
  createTimer: privateProcedure
    .input(z.object({ time: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(timerTable).values({
        time: input.time,
        userId: ctx.user.id,
      });
    }),

  updateTimer: privateProcedure
    .input(z.object({ id: z.number(), time: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(timerTable)
        .set({ time: input.time })
        .where(eq(timerTable.id, input.id));
    }),
});
