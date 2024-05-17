import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { compress } from "hono/compress";
import { objectRoutes } from "./routes/object";
import { mapsRoute } from "./routes/maps";
import { layersRoutes } from "./routes/layers";
import { objectPropertiesRoute } from "./routes/object-properties";
import { objectsRoutes } from "./routes/objects";
import { healthCheckRoutes } from "./routes/health-check";
import { mapTilesRoute } from "./routes/map-tiles";
import { geoJsonRoute } from "./routes/geojson";

const app = new Hono();

app.use("/*", cors());
app.use(compress({ encoding: "gzip" }));

app.route("/health-check", healthCheckRoutes);
app.route("/object", objectRoutes);
app.route("/objects", objectsRoutes)
app.route("/maps", mapsRoute);
app.route("/layers", layersRoutes);
app.route("/object/properties", objectPropertiesRoute);
app.route("/map-tiles", mapTilesRoute);
app.route("/geojson", geoJsonRoute);

const port = 3000;

console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
