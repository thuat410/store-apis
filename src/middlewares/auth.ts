import { createMiddleware } from "hono/factory";
import { createAuth } from "../lib/auth";
import { Bindings } from "../env";

type AuthType = ReturnType<typeof createAuth>;
type User = AuthType["$Infer"]["Session"]["user"];
type Session = AuthType["$Infer"]["Session"]["session"];

export type AuthVariables = {
  user: User;
  session: Session;
};

export const authMiddleware = createMiddleware<{
  Bindings: Bindings,
  Variables: AuthVariables
}>(async (c, next) => {
  const auth = createAuth(c.env.D1_DATABASE);
  const sessionData = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!sessionData)
    return c.json({
      code: "UNAUTHENTICATED",
      success: false,
      message: "Unauthenticated"
    }, 401);

  if (sessionData.user.banned) {
    return c.json({
      code: "FORBIDDEN",
      success: false,
      message: "Forbidden",
    }, 403);
  }
  c.set("user", sessionData.user);
  c.set("session", sessionData.session);

  await next();
});

export const requireAdmin = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const user = c.get("user");
  if (user?.role !== "admin")
    return c.json({
      code: "FORBIDDEN",
      success: false,
      message: "Forbidden - Admin access required"
    }, 401);
  await next();
});