import { UserAuthForm } from "@/components/signin-form";
import Link from "next/link";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex h-full dark:bg-zinc-950 lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
        </div>
        <UserAuthForm />
        {/* <p className="text-muted-foreground px-8 text-center text-sm">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p> */}
      </div>
    </div>
  );
}
