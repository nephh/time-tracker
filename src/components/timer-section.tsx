"use client";

import { api } from "@/trpc/react";
import { Button } from "./ui/button";
import { columns, TimerTable } from "./timer-table";

export default function TimerSection() {
  const [timers, query] = api.timer.getTimers.useSuspenseQuery();
  const createTimer = api.timer.createTimer.useMutation();

  async function handleClick() {
    createTimer.mutate();
  }

  // This runs quite a few times after creating a timer, might be able to optimize
  if (createTimer.isSuccess) {
    void query.refetch();
  }

  return (
    <div className="flex justify-center flex-col">
      <Button onClick={() => handleClick()} disabled={createTimer.isPending}>
        Create Timer
      </Button>
      <TimerTable columns={columns} data={timers ?? []} />
    </div>
  );
}