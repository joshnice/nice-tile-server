import { Hono } from "hono";
import { getAllMaps, getMap, postMap } from "../models/maps";
import { validator } from "hono/validator";

export const mapsRoute = new Hono();

mapsRoute.get("", async (ctx) => {
	const map = await getAllMaps();

	return ctx.json(map);
});

mapsRoute.get("/:id", async (ctx) => {
	const mapId = ctx.req.param("id");

	const map = await getMap(mapId);

	return ctx.json(map);
});

mapsRoute.post(
	"",
	validator("json", (body, c) => {
		const mapId = body.id;
		const mapName = body.name;
		if (mapId !== null && mapName != null) {
			return {
				body,
			};
		}
		return c.text("Invalid", 400);
	}),
	async (c) => {
		const { body } = c.req.valid("json");
		await postMap(body);
		return c.text("Success", 200);
	},
);
