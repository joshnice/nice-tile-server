import { Hono } from "hono"

export const healthCheckRoutes = new Hono();

healthCheckRoutes.get("", async (ctx) => ctx.text("Success", 200));