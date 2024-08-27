"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import type { User } from "lucia";

interface TimerProps {
  user: User;
}

export default function Timer({ user }: TimerProps) {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const mutate = api.timer.createTimer.useMutation();
  const update = api.timer.updateTimer.useMutation();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    console.log(isRunning);

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    if (isRunning) {
      handleUpdateTimer();
    }

    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  function handleAddTimer() {
    mutate.mutate({
      time: timer,
      userId: user.id,
    });
  }

  function handleUpdateTimer() {
    update.mutate({
      id: 1,
      time: timer,
    });
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Timer</h1>
        <div>{timer}</div>
        <button onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>{" "}
      <Button
        variant="default"
        onClick={() => handleAddTimer()}
        disabled={mutate.isPending}
      >
        Add Timer
      </Button>
    </div>
  );
}
