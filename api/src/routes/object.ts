import { Hono } from "hono";
import { validator } from "hono/validator";
import { Feature, Point, LineString, Polygon } from "geojson";
import { getObjects, postObject } from "../models/objects";

export const objectRoutes = new Hono();

objectRoutes.get("/:z/:x/:y", async (ctx) => {
    const x = ctx.req.param('x');
    const y = ctx.req.param('y');
    const z = ctx.req.param('z');

    const numX = parseInt(x, 10);
    const numY = parseInt(y, 10);
    const numZ = parseInt(z, 10);

    const objectTile = await getObjects(numX, numY, numZ);
    console.log("objectTile", objectTile);
    // @ts-ignore
    const response = new Response(objectTile, { status: 200 });
    response.headers.set('Content-Type', 'application/vnd.mapbox-vector-tile');
    return response;
});

const isObjectValid = (feature: Feature<Point | Polygon | LineString>) => {
    if (feature == null) {
        return false;
    }

    if (feature.type !== "Feature") {
        return false;
    }

    const isValidPoint = feature.geometry.type === "Point" && typeof feature.geometry.coordinates[0] === "number" && typeof feature.geometry.coordinates[1] === "number";

    return isValidPoint;
}

objectRoutes.post("", validator("json", (body, c) => {
    const mapId = body.mapId;
    const object = body.object && isObjectValid(body.object);
    if (mapId && object) {
        return {
            body
        }
    }
    return c.text("Invalid", 400);
}), async (c) => {
    const {body} = c.req.valid("json")
    console.log("body", body);
    await postObject(body.mapId, body.object);
    return c.text("Success", 200)    
});

