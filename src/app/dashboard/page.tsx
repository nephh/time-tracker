import { HydrateClient } from "@/trpc/server";
import TimerSection from "@/components/timer-section";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-6/12">
        <TimerSection />
      </div>
    </main>
  );
}
