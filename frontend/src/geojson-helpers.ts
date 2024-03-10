import { Feature, Point, LineString, Polygon } from "geojson";

export function createPointFeature(coordinates: number[]): Feature<Point> {

    if (coordinates == null || coordinates.length !== 2 || !coordinates.every(checkCoordinateIsNumber)) {
        throw new Error("Invalid coordinates")
    }

    return {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: coordinates
        },
        properties: {},
    }
}

export function createLineFeature(coordinates: number[][]): Feature<LineString> {

    if (coordinates == null || coordinates.length < 2 || !coordinates[0].every(checkCoordinateIsNumber)) {
        throw new Error("Invalid coordinates")
    }

    return {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: coordinates
        },
        properties: {},
    }
}

export function createPolygonFeature(coordinates: number[][][]): Feature<Polygon> {

    if (coordinates == null || coordinates[0].length < 2 || !coordinates[0][0].every(checkCoordinateIsNumber)) {
        throw new Error("Invalid coordinates")
    }

    return {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: coordinates
        },
        properties: {},
    }
}


function checkCoordinateIsNumber (coordinate: number) { 
    return typeof coordinate === "number" && isNaN(coordinate) === false 
}