import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from './lib/auth';
import { Bindings } from "./env";
import adminRoutes from "./routes/admin.route";
import { authMiddleware } from './middlewares/auth';

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", cors({
  origin: (origin) => origin,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}));

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return createAuth(c.env.D1_DATABASE).handler(c.req.raw);
});

app.get("/api", (c) => {
  return c.text("Server is running!");
});

app.get("/api/me", authMiddleware, (c) => {
  const user = c.get("user");
  return c.json(user);
});

app.route("/api/admin", adminRoutes);

app.onError((err, c) => {
  console.error("❌ Server has error: ", err);
  return c.json({
    code: "INTERNAL_SERVER_ERROR",
    success: false,
    message: "There is error. Please try again later."
  }, 500);
});

export default app;
