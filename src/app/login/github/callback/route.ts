import {
  createSession,
  generateSessionToken,
  github,
  setSessionTokenCookie,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { userTable } from "@/server/db/schema";
import { generateRandomString, alphabet } from "oslo/crypto";

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
      const token = generateSessionToken();
      const session = await createSession(token, existingUser.id);
      setSessionTokenCookie(token, session.expiresAt);

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

    const userId = generateRandomString(10, alphabet("a-z", "0-9"));

    const [user] = await db
      .insert(userTable)
      .values({
        id: userId,
        githubId: githubUser.id,
        username: githubUser.login,
        email: primaryEmail.email,
      })
      .returning();

    if (!user) {
      throw Error("Error creating user");
    }

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setSessionTokenCookie(token, session.expiresAt);

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
