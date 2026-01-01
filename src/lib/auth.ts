import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { D1Database } from "@cloudflare/workers-types";
import { createDb } from "../db";
import { openAPI } from 'better-auth/plugins';

export const createAuth = (d1: D1Database) => {
  const db = createDb(d1);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite", // D1 là SQLite
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      openAPI(),
    ]
  });
};