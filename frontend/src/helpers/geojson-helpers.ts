import type { Feature, Point, LineString, Polygon, FeatureCollection } from "geojson";
import type { Layer } from "../mapbox/layers/layer";
import type { RandomObjectProperty } from "../types/properties";
import { v4 as uuid } from "uuid";
import { randomPoint, randomLineString, randomPolygon } from "@turf/random";
import bbox from "@turf/bbox";
import { FillLayer } from "../mapbox/layers/fill-layer";
import { LineLayer } from "../mapbox/layers/line-layer";
import { CircleLayer } from "../mapbox/layers/circle-layer";
import { createRandomProperties } from "./random-object-property-helpers";

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

export function generateRandomObjects(layer: Layer, amount: number, area: Feature<Polygon>, properties: RandomObjectProperty[]) {
	const bounds = bbox(area);
	let featureCollection: FeatureCollection<Polygon | LineString | Point>; 
	switch (true) {
		case layer instanceof FillLayer:
			featureCollection = randomPolygon(amount, { bbox: bounds, max_radial_length: 0.001, num_vertices: 4 });
			break;
		case layer instanceof LineLayer:
			featureCollection = randomLineString(amount, { bbox: bounds, num_vertices: 5 });
			break;
		case layer instanceof CircleLayer:
			featureCollection = randomPoint(amount, { bbox: bounds });
			break;
		default:
			throw new Error("Type not supported");
	}

	return featureCollection.features.map((feature, index) => ({...feature, properties: { layerId: layer.id, id: uuid(), ...createRandomProperties(index, properties) }}));
}

function checkCoordinateIsNumber(coordinate: number) {
	return typeof coordinate === "number" && Number.isNaN(coordinate) === false;
}
