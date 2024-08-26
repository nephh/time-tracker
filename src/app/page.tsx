import { HydrateClient } from "@/trpc/server";
import Timer from "@/components/timer";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div>
          <Timer />
        </div>
      </main>
    </HydrateClient>
  );
}
