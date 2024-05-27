import { Hono } from "hono";
import { validator } from "hono/validator";
import { getMapLayers, postLayer } from "../models/layers";
import { createStyle, getStyle } from "../models/styles";
import { DbStyleToAllStyle } from "../maps/DbStyle-to-AllStyles";

export const layersRoutes = new Hono();

layersRoutes.get("/:mapId", async (ctx) => {
	const mapId = ctx.req.param("mapId");
	const layers = await getMapLayers(mapId);
	const styles = await Promise.all(layers.map((layer) => getStyle(layer.id)));

	layers.forEach((layer) => {
		const style = styles.find((style) => style.layer_id === layer.id);

		if (style == null) {
			console.error(`Could not find style for ${layer.id}`);
		} else {
			layer.style = DbStyleToAllStyle(style);
		}
	});
	return ctx.json(layers);
});

layersRoutes.post(
	"",
	validator("json", (body, c) => {
		const { id, name, mapId, type, style } = body;
		if (id != null && name != null && mapId != null && type != null && style != null) {
			return {
				body,
			};
		}
		return c.text("Invalid", 400);
	}),
	async (ctx) => {
		const { body } = ctx.req.valid("json");
		await postLayer(body);
		await createStyle(body.id, body.style);
		return ctx.text("Success", 200);
	},
);
