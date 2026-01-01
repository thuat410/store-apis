import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from './lib/auth';
import { Bindings } from "./env";

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

app.get("/", (c) => {
  return c.text("Server is running!");
});

app.onError((err, c) => {
  console.error("❌ Server has error:", err);
  return c.json({
    success: false,
    message: err.message,
    stack: err.stack
  }, 500);
});

export default app;
