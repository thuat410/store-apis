import { D1Database } from "@cloudflare/workers-types";

export type Bindings = {
  D1_DATABASE: D1Database;
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
};

export type Variables = {
  user: any;
};