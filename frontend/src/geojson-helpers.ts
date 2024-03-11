import { Feature, Point, LineString, Polygon } from "geojson";

type Properties = { layerId: string };

export function createPointFeature(coordinates: number[]): Feature<Point, Properties> {

    if (coordinates == null || coordinates.length !== 2 || !coordinates.every(checkCoordinateIsNumber)) {
        throw new Error("Invalid coordinates")
    }

    return {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: coordinates
        },
        properties: {
            layerId: "Point"
        },
    }
}

export function createLineFeature(coordinates: number[][]): Feature<LineString, Properties> {

    if (coordinates == null || coordinates.length < 2 || !coordinates[0].every(checkCoordinateIsNumber)) {
        throw new Error("Invalid coordinates")
    }

    return {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: coordinates
        },
        properties: {
            layerId: "Line"
        },
    }
}

export function createPolygonFeature(coordinates: number[][][]): Feature<Polygon, Properties> {

    if (coordinates == null || coordinates[0].length < 2 || !coordinates[0][0].every(checkCoordinateIsNumber)) {
        throw new Error("Invalid coordinates")
    }

    return {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: coordinates
        },
        properties: {
            layerId: "Fill"
        },
    }
}


function checkCoordinateIsNumber (coordinate: number) { 
    return typeof coordinate === "number" && isNaN(coordinate) === false 
}