import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { validateRequest } from "./auth";
import { redirect } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function validateUser() {
  "use server";
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return user;
}
