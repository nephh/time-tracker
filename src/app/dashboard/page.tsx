import { api, HydrateClient } from "@/trpc/server";
import TimerSection from "@/components/timer-section";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function Page() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  void api.timer.getTimers.prefetch();

  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col items-center justify-center">
        {/* <div className="w-6/12"> */}
          {/* <TimerSection /> */}
          <TooltipProvider>
            <Dashboard />
          </TooltipProvider>
        {/* </div> */}
      </div>
    </HydrateClient>
  );
}
