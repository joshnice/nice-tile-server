import { Feature, Point } from "geojson";

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


function checkCoordinateIsNumber (coordinate: number) { 
    return typeof coordinate === "number" && isNaN(coordinate) === false 
}