import { Hono } from "hono";
import { validator } from "hono/validator";
import { getObjects, postObject } from "../models/objects";
import { isObjectValid, parseObjectProperties } from "../helpers/object-validator";

export const objectRoutes = new Hono();

objectRoutes.get("/:mapId/:z/:x/:y", async (ctx) => {
	const mapId = ctx.req.param("mapId");
	const x = ctx.req.param("x");
	const y = ctx.req.param("y");
	const z = ctx.req.param("z");

	const numX = Number.parseInt(x, 10);
	const numY = Number.parseInt(y, 10);
	const numZ = Number.parseInt(z, 10);

	const objectTile = await getObjects(numX, numY, numZ, mapId);
	// @ts-ignore
	const response = new Response(objectTile, { status: 200 });
	response.headers.set("Content-Type", "application/vnd.mapbox-vector-tile");
	return response;
});


objectRoutes.post(
	"",
	validator("json", (body, c) => {
		const mapId = body.mapId;
		const object = body.object && isObjectValid(body.object);
		if (mapId && object) {
			return {
				body,
			} ;
		}
		return c.text("Invalid", 400);
	}),
	async (c) => {
		const { body } = c.req.valid("json");
		await postObject(body.mapId, body.object, body.object.properties.layerId, parseObjectProperties(body.object.properties));
		return c.text("Success", 200);
	},
);
