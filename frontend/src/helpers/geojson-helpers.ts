import type { Feature, Point, LineString, Polygon } from "geojson";
import { v4 as uuid } from "uuid";

type Properties = { layerId: string, id: string };

export function createPointFeature(
	coordinates: number[],
	layerId: string,
): Feature<Point, Properties> {
	if (
		coordinates == null ||
		coordinates.length !== 2 ||
		!coordinates.every(checkCoordinateIsNumber)
	) {
		throw new Error("Invalid coordinates");
	}

	return {
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: coordinates,
		},
		properties: {
			layerId,
			id: uuid(),
		},
	};
}

export function createLineFeature(
	coordinates: number[][],
	layerId: string,
): Feature<LineString, Properties> {
	if (
		coordinates == null ||
		coordinates.length < 2 ||
		!coordinates[0].every(checkCoordinateIsNumber)
	) {
		throw new Error("Invalid coordinates");
	}

	return {
		type: "Feature",
		geometry: {
			type: "LineString",
			coordinates: coordinates,
		},
		properties: {
			layerId,
			id: uuid()
		},
	};
}

export function createPolygonFeature(
	coordinates: number[][][],
	layerId: string,
): Feature<Polygon, Properties> {
	if (
		coordinates == null ||
		coordinates[0].length < 2 ||
		!coordinates[0][0].every(checkCoordinateIsNumber)
	) {
		throw new Error("Invalid coordinates");
	}

	return {
		type: "Feature",
		geometry: {
			type: "Polygon",
			coordinates: coordinates,
		},
		properties: {
			layerId,
			id: uuid()
		},
	};
}

function checkCoordinateIsNumber(coordinate: number) {
	return typeof coordinate === "number" && Number.isNaN(coordinate) === false;
}
