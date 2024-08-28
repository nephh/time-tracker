"use client";

import { api } from "@/trpc/react";
import Timer from "./timer";
import { Button } from "./ui/button";

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
    <div>
      <Button onClick={() => handleClick()} disabled={createTimer.isPending}>
        Create Timer
      </Button>
      {timers ? (
        timers.map((timer) => (
          <Timer key={timer.id} id={timer.id} timerTime={timer.time} />
        ))
      ) : (
        <p>No Timers</p>
      )}
    </div>
  );
}
