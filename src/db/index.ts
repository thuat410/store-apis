import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { D1Database } from "@cloudflare/workers-types";

export const createDb = (d1: D1Database) => {
  return drizzle(d1, { schema });
};