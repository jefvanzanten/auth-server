import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";

const app = new Hono();

// Middleware
app.use("*", logger());

// CORS configuratie voor cross-app authenticatie
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000", // TanStack Start portfolio
      "http://localhost:3001", // Other apps
      "http://localhost:5173", // Vite apps
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Health check
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Auth Server is running",
    version: "1.0.0",
  });
});

// Better Auth routes - handles all /api/auth/* endpoints
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// Start server
const port = Number(process.env.PORT) || 3333;

console.log(`Auth Server running on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
