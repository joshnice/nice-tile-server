import type { Feature, FeatureCollection } from "geojson";
import { v4 as uuid } from "uuid";
import { createGeoJSONFile, createMapTilesDirectory, getLocalMapTile, runMbUtil, runTippecanoe } from "../local-file-system/map-tiles";
import { listObjectsByMapId } from "./objects";
import { client } from "../db/connection";

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

    await createMapTilesDirectory(mapId);

    await createGeoJSONFile(mapId, featureCollection);

    await runTippecanoe(mapId);

    await runMbUtil(mapId);

    const mapTiles = await getMapTiles(mapId);

    if (mapTiles == null) {

        const SQL = `
            insert into map_tile_set (id, map_id)
            values ($1, $2);
        `;

        await client.query(SQL, [uuid(), mapId]);
    }
}

export async function getMapTiles(mapId: string) {
    const SQL = `
        select * from map_tile_set where map_id = $1
    `;

    const response = await client.query(SQL, [mapId]);

    return response.rows[0];
}