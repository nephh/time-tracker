"use client";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-950 px-2">
            Sign in with your favorite provider
          </span>
        </div>
      </div>
      <Link href="/login/github" prefetch={false}>
        <Button
          className="w-full"
          variant="secondary"
          type="button"
          disabled={isLoading}
          onClick={() => setIsLoading(true)}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{" "}
          GitHub
        </Button>
      </Link>
    </div>
  );
}
