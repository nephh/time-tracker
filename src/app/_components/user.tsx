import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import type { CurrentUser } from "@/lib/types";

export default async function User() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const currentUser = user as CurrentUser;

  return <h1>Hi, {currentUser.username}!</h1>;
}
