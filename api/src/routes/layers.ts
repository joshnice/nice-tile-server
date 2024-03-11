import { Hono } from "hono";
import { validator } from "hono/validator";
import { getMapLayers, postLayer } from "../models/layers";

export const layersRoutes = new Hono();

layersRoutes.get("/:mapId", async (ctx) => {
	const mapId = ctx.req.param("mapId");
	const layers = await getMapLayers(mapId);
	return ctx.json(layers);
});

layersRoutes.post(
	"",
	validator("json", (body, c) => {
		const { id, name, mapId, type } = body;
		const mapName = body.name;
		if (id != null && name != null && mapId != null && type != null) {
			return {
				body,
			};
		}
		return c.text("Invalid", 400);
	}),
	async (ctx) => {
		const { body } = ctx.req.valid("json");
		await postLayer(body);
		return ctx.text("Success", 200);
	},
);
