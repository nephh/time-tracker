import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

export default async function User() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return <h1>Hi, {user.id}!</h1>;
}
