import type { FeatureCollection } from "geojson";
import { readFile, createDirectory, deleteDirectory, findDirectory, writeFile } from "./local-file-system-read-helpers";

const basePath = "/home/joshnice/Documents/mapbox-tiles"

export async function getLocalMapTile(x: number, y: number, z: number) {
    const file = await readFile(`${basePath}/nice-tile-server/${z}/${x}/${y}.pbf`, false);
    return file;
}

export async function createMapTilesDirectory(mapId: string) {
    const path = `${basePath}/${mapId}`;
    const mapHasTilesDirectory = findDirectory(path);
    if (mapHasTilesDirectory) {
        await deleteDirectory(path);
    }

    await createDirectory(basePath, mapId);
}

export async function createGeoJSONFile(mapId: string, mapObjects: FeatureCollection) {
    const path = `${basePath}/${mapId}.json`;
    await writeFile(path, JSON.stringify(mapObjects));
}