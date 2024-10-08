import { github, lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { userTable } from "@/server/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUserEmailsResponse = await fetch(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const githubUserEmails =
      (await githubUserEmailsResponse.json()) as GitHubUserEmail[];
    const githubUser = (await githubUserResponse.json()) as GitHubUser;
    const primaryEmail =
      githubUserEmails.find((email) => email.primary) ?? null;

    if (!primaryEmail) {
      return new Response("No primary email address", {
        status: 400,
      });
    }

    if (!primaryEmail.verified) {
      return new Response("Unverified email", {
        status: 400,
      });
    }

    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, primaryEmail.email));

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      if (!existingUser.githubId) {
        await db
          .update(userTable)
          .set({ githubId: githubUser.id })
          .where(eq(userTable.id, existingUser.id));
      }

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await db.insert(userTable).values({
      id: userId,
      githubId: githubUser.id,
      username: githubUser.login,
      email: primaryEmail.email,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    console.error("Unexpected error:", e); // Log the error details
    return new Response(null, {
      status: 500,
    });
  }
}

interface GitHubUser {
  id: string;
  login: string;
}

interface GitHubUserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}
