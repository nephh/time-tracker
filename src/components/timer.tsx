"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

interface TimerProps {
  timerTime: number;
  id: number;
}

export default function Timer({ timerTime, id }: TimerProps) {
  const [time, setTime] = useState(timerTime);
  const [isRunning, setIsRunning] = useState(false);
  const update = api.timer.updateTimer.useMutation();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
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

  function handleUpdateTimer() {
    update.mutate({
      id,
      time,
    });
  }

  function formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Timer</h1>
        <div>{formatTime(time)}</div>
        <button onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>{" "}
    </div>
  );
}
