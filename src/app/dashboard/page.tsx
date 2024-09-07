import { api, HydrateClient } from "@/trpc/server";
import TimerSection from "@/components/timer-section";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { validateUser } from "@/lib/utils";

export default async function Page() {
  const user = await validateUser();

  console.log(user);

  void api.timer.getTimers.prefetch();

  return (
    <HydrateClient>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of your tasks for this month!
        </p>
      </div>
      <div className="w-6/12">
        <TimerSection />
      </div>
    </HydrateClient>
  );
}
