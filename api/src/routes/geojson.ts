import { Hono } from "hono"
import type { FeatureCollection } from "geojson";
import { listObjectsByLayerId } from "../models/objects";

export const geoJsonRoute = new Hono();

geoJsonRoute.get("/:layerId", async (ctx) => {
    const layerId = ctx.req.param("layerId");
    const objects = await listObjectsByLayerId(layerId);
    const featureCollection: FeatureCollection = {
        type: "FeatureCollection",
        features: []
    }
    objects.forEach((object) => {
        const feature = JSON.parse(object.geom);
        featureCollection.features.push({ ...feature, properties: object.properties })
    });

    ctx.status(200);
    return ctx.json(featureCollection);
});