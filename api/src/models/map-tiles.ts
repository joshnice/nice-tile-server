import type { Feature, FeatureCollection } from "geojson";
import { v4 as uuid } from "uuid";
import { createGeoJSONFile, createMapTilesDirectory, getLocalMapTile, joinTiles, runMbUtil, runTippecanoe } from "../local-file-system/map-tiles";
import { listObjectsByLayerId } from "./objects";
import { client } from "../db/connection";
import { DbMapTileToMapTile } from "../maps/DbMapTile-to-MapTile";
import { getMapLayers } from "./layers";

export function getMapTile(x: number, y: number, z: number, mapId: string) {
    return getLocalMapTile(x, y, z, mapId);
}

export async function listMapTiles() {
    const SQL = `
        select 
            mts.id,
            mts.map_id,
            m."name" 
        from
            map_tile_set mts
        left join maps m 
            on mts.map_id = m.id
    `;

    const response = await client.query(SQL);

    return response.rows.map(DbMapTileToMapTile);
}

export async function createMapTiles(mapId: string) {
    // Get all resources for maps
    const layers = await getMapLayers(mapId);

    const layersAmount = layers.length;
    console.log("Got layers, total amount: ", layersAmount);

    await createMapTilesDirectory(mapId);
    console.log("Created new directory");

    const createLayerMbTilesRequests = layers.map(async (layer, index) => {
        console.log("Processing layer number: ", index);
        const mapObjects = await listObjectsByLayerId(layer.id);

        const parsedObjects: Feature[] = mapObjects.map((object) => {
            const feature = JSON.parse(object.geom);
            return { ...feature, properties: object.properties, id: object.id }
        });
        console.log(`Created feature collection with ${parsedObjects.length} for layer ${index}`);

        const featureCollection: FeatureCollection = {
            type: "FeatureCollection",
            features: parsedObjects,
        }

        await createGeoJSONFile(layer.id, mapId, featureCollection);
        console.log("Created GeoJSON file for layer ", index);

        await runTippecanoe(layer.id, mapId);
        console.log("Ran tippecanoe file for layer ", index);
    });

    await Promise.all(createLayerMbTilesRequests);

    await joinTiles(layers.map((l) => l.id), mapId);
    console.log("Joined tiles");

    await runMbUtil(mapId);
    console.log("Ran mbutil");

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