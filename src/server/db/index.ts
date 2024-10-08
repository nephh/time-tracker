import { drizzle } from "drizzle-orm/vercel-postgres";
import postgres from "postgres";
import { sql } from "@vercel/postgres";
import { env } from "@/env";
import * as schema from "./schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.POSTGRES_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  schema.sessionTable,
  schema.userTable,
);
