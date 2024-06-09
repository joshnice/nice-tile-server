import { Hono } from "hono";
import { createMapTiles, getMapTile, listMapTiles } from "../models/map-tiles";

export const mapTilesRoute = new Hono();

mapTilesRoute.get("/:z/:x/:y", async (ctx) => {
    const x = ctx.req.param("x");
    const y = ctx.req.param("y");
    const z = ctx.req.param("z");

    const numX = Number.parseInt(x, 10);
    const numY = Number.parseInt(y, 10);
    const numZ = Number.parseInt(z, 10);

    try {
        const objectTile = await getMapTile(numX, numY, numZ);

        if (objectTile) {
            ctx.status(200);
            ctx.header("Content-Type", "binary/octet-stream");
            ctx.header("Content-Encoding", "gzip");
            ctx.header("Content-Length", objectTile.length.toString());
            return ctx.body(objectTile);
        }
        ctx.status(404);
        return ctx.json({ error: "Tile not found" });
    } catch (error) {
        console.error("Error fetching tile:", error);
        ctx.status(500);
        return ctx.json({ error: "Internal Server Error" });
    }
});

mapTilesRoute.get("", async (ctx) => {
    const results = await listMapTiles();
    return ctx.json(results);
});

mapTilesRoute.post("/:mapId", async (ctx) => {
    try {
        const mapId = ctx.req.param("mapId");
        await createMapTiles(mapId);
        ctx.status(200);
        return ctx.text("Success");
    } catch (err) {
        ctx.status(500);
        return ctx.json(err);
    }
});
