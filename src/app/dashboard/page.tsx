import { api, HydrateClient } from "@/trpc/server";
import Dashboard from "@/components/dashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { validateUser } from "@/lib/validate";

export default async function Page() {
  const user = await validateUser();

  console.log(user);

  void api.timer.getTimers.prefetch();

  return (
    <HydrateClient>
      {/* <div className="w-6/12"> */}
      <TooltipProvider>
        <Dashboard />
      </TooltipProvider>
      {/* </div> */}
    </HydrateClient>
  );
}
