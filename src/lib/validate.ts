"use server";

import { redirect } from "next/navigation";
import { validateRequest } from "./auth";

export async function validateUser() {
  const user = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return user;
}
