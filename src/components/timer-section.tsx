"use client";

import { api } from "@/trpc/react";
import { Button } from "./ui/button";
import { columns, TimerTable } from "./timer-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

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
    <div className="flex flex-col items-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-32">Create Timer</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a timer</DialogTitle>
            <DialogDescription>
              Pick a name and starting time for your new timer.
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="name">Link</Label>
          <Input id="name" defaultValue={"My new timer"} />
          <Label htmlFor="time">Time in seconds</Label>
          <Input id="time" type="number" defaultValue={0} min={0} />
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
              <Button
                type="submit"
                variant="default"
                onClick={() => handleClick()}
              >
                Create
              </Button>
          </DialogFooter>
        </DialogContent>
        <TimerTable columns={columns} data={timers ?? []} />
      </Dialog>
    </div>
  );
}
