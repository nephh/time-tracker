import { HydrateClient } from "@/trpc/server";
import Timer from "@/components/timer";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div>
          <Timer user={user} />
        </div>
      </main>
    </HydrateClient>
  );
}
