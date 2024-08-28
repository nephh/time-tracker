import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { timerTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const timerRouter = createTRPCRouter({
  createTimer: privateProcedure.mutation(async ({ ctx }) => {
    await ctx.db.insert(timerTable).values({
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

  getTimers: privateProcedure.query(async ({ ctx }) => {
    const timers = await ctx.db
      .select({
        id: timerTable.id,
        time: timerTable.time,
      })
      .from(timerTable)
      .where(eq(timerTable.userId, ctx.user.id));

    return timers;
  }),
});
