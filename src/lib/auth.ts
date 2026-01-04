import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { D1Database } from "@cloudflare/workers-types";
import { createDb } from "../db";
import { admin, openAPI } from 'better-auth/plugins';

export const createAuth = (d1: D1Database) => {
  const db = createDb(d1);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      openAPI(),
      admin({
        defaultRole: "user",
        adminRole: "admin",
      }),
    ],
  });
};