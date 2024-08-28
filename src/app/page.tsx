import { HydrateClient } from "@/trpc/server";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import TimerSection from "@/components/timer-section";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  // console.log(timers);

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div>
          <TimerSection />
        </div>
      </main>
    </HydrateClient>
  );
}
