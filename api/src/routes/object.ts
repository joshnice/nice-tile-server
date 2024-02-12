import { Hono } from "hono";
import { getObjects } from "../models/objects";

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

