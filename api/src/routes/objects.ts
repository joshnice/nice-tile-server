import { Hono } from "hono";
import { validator } from "hono/validator";
import {  postObjects } from "../models/objects";
import { isObjectValid, parseObjectProperties } from "../helpers/object-validator";

export const objectsRoutes = new Hono();

objectsRoutes.post(
	"",
	validator("json", (body, c) => {
		const mapId = body.mapId;
		const objectsValid = body.objects?.every(isObjectValid);
		if (mapId && objectsValid) {
			return {
				body,
			};
		}
		return c.text("Invalid", 400);
	}),
	async (c) => {
		const { body } = c.req.valid("json");
		await postObjects(body.mapId, body.objects, body.objects[0].properties.layerId, body.objects.map((object: { properties: Record<string, string | number>; }) => parseObjectProperties(object.properties)));
		return c.text("Success", 200);
	},
);
