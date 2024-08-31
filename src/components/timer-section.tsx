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
import { useState } from "react";
import { Icons } from "./ui/icons";

export default function TimerSection() {
  const [open, setOpen] = useState(false);
  const [timers] = api.timer.getTimers.useSuspenseQuery();
  const utils = api.useUtils();
  const createTimer = api.timer.createTimer.useMutation({
    onSuccess: async () => {
      await utils.timer.invalidate();
    },
  });

  async function handleClick() {
    await createTimer.mutateAsync();
    setOpen(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
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
              <Button
                type="button"
                variant="secondary"
                disabled={createTimer.isPending}
                className="w-20"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="default"
              onClick={() => handleClick()}
              disabled={createTimer.isPending}
              className="w-20"
            >
              {createTimer.isPending ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              ) : (
                `Create`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
        <TimerTable columns={columns} data={timers ?? []} />
      </Dialog>
    </div>
  );
}
