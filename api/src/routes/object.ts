import { Hono } from "hono";
import { validator } from "hono/validator";
import type { Feature, Point, LineString, Polygon } from "geojson";
import { getObjects, postObject } from "../models/objects";

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

const isObjectValid = (
	feature: Feature<Point | Polygon | LineString, { layerId: string, id: string }>,
) => {
	if (feature == null) {
		return false;
	}

	if (feature.type !== "Feature") {
		return false;
	}

	if (feature.properties.layerId == null) {
		return false;
	}

	if (feature.properties.id == null) {
		return false;
	}

	const isValidPoint =
		feature.geometry.type === "Point" &&
		typeof feature.geometry.coordinates[0] === "number" &&
		typeof feature.geometry.coordinates[1] === "number";
	const isValidLine =
		feature.geometry.type === "LineString" &&
		feature.geometry.coordinates.length !== 1 &&
		feature.geometry.coordinates.every(
			(coord) =>
				coord.length === 2 &&
				coord.every((c) => typeof c === "number" && Number.isNaN(c) === false),
		);
	const isValidPolygon =
		feature.geometry.type === "Polygon" &&
		feature.geometry.coordinates.length === 1 &&
		feature.geometry.coordinates[0].length !== 1 &&
		feature.geometry.coordinates[0].every(
			(coord) =>
				coord.length === 2 &&
				coord.every((c) => typeof c === "number" && Number.isNaN(c) === false),
		);

	return isValidPoint || isValidLine || isValidPolygon;
};

objectRoutes.post(
	"",
	validator("json", (body, c) => {
		const mapId = body.mapId;
		const object = body.object && isObjectValid(body.object);
		if (mapId && object) {
			return {
				body,
			};
		}
		return c.text("Invalid", 400);
	}),
	async (c) => {
		const { body } = c.req.valid("json");
		const validProps: Record<string, string | number> = {};
		Object.entries(body.object.properties).forEach(([key, value]) => {
			if (key !== "layerId" && key !== "id" && typeof value === "string" || typeof value === "number" ) {
				validProps[key] = value;
			}
		});
		await postObject(body.mapId, body.object, body.object.properties.layerId, validProps);
		return c.text("Success", 200);
	},
);
