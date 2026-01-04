import { Hono } from "hono";
import { Bindings } from "../env";
import { authMiddleware, AuthVariables, requireAdmin } from "../middlewares/auth";
import { createDb } from '../db';
import { user } from '../db/schema';
import { eq } from 'drizzle-orm';

const app = new Hono<{ Bindings: Bindings, Variables: AuthVariables }>();

app.use("*", authMiddleware, requireAdmin);

app.get("/users", async (c) => {
  const db = createDb(c.env.D1_DATABASE);
  const users = await db.select().from(user).all();
  return c.json(users);
});

app.delete("/users/:id", async (c) => {
  const db = createDb(c.env.D1_DATABASE);
  const id = c.req.param("id");
  await db.delete(user).where(eq(user.id, id)).execute();
  return c.json({ message: "User deleted successfully" });
})

export default app;