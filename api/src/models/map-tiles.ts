import type { Feature, FeatureCollection } from "geojson";
import { createGeoJSONFile, getLocalMapTile } from "../local-file-system/map-tiles";
import { listObjectsByMapId } from "./objects";
import { PromiseAdapter } from "pg-promise";

export function getMapTile(x: number, y: number, z: number) {
    return getLocalMapTile(x, y, z);
}

export async function createMapTiles(mapId: string) {

    // Get all map objects
    const mapObjects = await listObjectsByMapId(mapId);

    const parsedObjects: Feature[] = mapObjects.map((object) => {
        const feature = JSON.parse(object.geom);
        return { ...feature, properties: object.properties, id: object.id }
    });

    const featureCollection: FeatureCollection = {
        type: "FeatureCollection",
        features: parsedObjects,
    }

    await createGeoJSONFile(mapId, featureCollection);

    // Run tippiecannoe


    // Run mbtile util
    // Add to db
}