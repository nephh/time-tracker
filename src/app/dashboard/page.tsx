import { api, HydrateClient } from "@/trpc/server";
import TimerSection from "@/components/timer-section";

export default async function Page() {
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
