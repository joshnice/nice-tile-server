import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { objectRoutes } from "./routes/object";
import { mapsRoute } from "./routes/maps";
import { layersRoutes } from "./routes/layers";
import { objectPropertiesRoute } from "./routes/object-properties";
import { objectsRoutes } from "./routes/objects";
import { healthCheckRoutes } from "./routes/health-check";

const app = new Hono();

app.use("/*", cors());

app.route("/health-check", healthCheckRoutes);
app.route("/object", objectRoutes);
app.route("/objects", objectsRoutes)
app.route("/maps", mapsRoute);
app.route("/layers", layersRoutes);
app.route("/object/properties", objectPropertiesRoute);

const port = 3000;

console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
