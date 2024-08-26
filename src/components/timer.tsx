"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { api } from "@/trpc/server";

export default function Timer() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

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
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  function handleAddTimer() {
    const { data } = api.timer.createTimer({
      time: timer,
      userId: "1",
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
      <Button variant="default">Add Timer</Button>
    </div>
  );
}
