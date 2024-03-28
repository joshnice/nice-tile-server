import type { Feature, Point, LineString, Polygon } from "geojson";

export const isObjectValid = (
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

export function parseObjectProperties(properties: Record<string, string | number>) {
    const validProps: Record<string, string | number> = {};
    Object.entries(properties).forEach(([key, value]) => {
        if (key !== "layerId" && key !== "id" && typeof value === "string" || typeof value === "number" ) {
            validProps[key] = value;
        }
    });
    return validProps;
}
