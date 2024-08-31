import { api, HydrateClient } from "@/trpc/server";
import TimerSection from "@/components/timer-section";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  void api.timer.getTimers.prefetch();

  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-6/12">
          <TimerSection />
        </div>
      </div>
    </HydrateClient>
  );
}
