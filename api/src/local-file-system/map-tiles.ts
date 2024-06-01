import type { FeatureCollection } from "geojson";
import { readFile, createDirectory, deleteDirectory, findDirectory, writeFile, shellCommand } from "./local-file-system-read-helpers";

const basePath = "/home/joshnice/Documents/mapbox-tiles"

function createChangeDirectoryCommand(mapId: string) {
    return `cd ${basePath}/${mapId}`;
}

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
    const path = `${basePath}/${mapId}/${mapId}.json`;
    await writeFile(path, JSON.stringify(mapObjects));
}

export async function runTippecanoe(mapId: string) {
    const changeDirectoryCommand = createChangeDirectoryCommand(mapId);
    const tippecanoeCommand = `tippecanoe -o ${mapId}.mbtiles -l ${mapId} -n "${mapId}" -B19 -r1.5 -Z10 --force -z22 -D11 -d9 -an "${mapId}.json"`;
    const combinedCommand = `${changeDirectoryCommand} && ${tippecanoeCommand}`;
    await shellCommand(combinedCommand);
}

export async function runMbUtil(mapId: string) {
    const changeDirectoryCommand = createChangeDirectoryCommand(mapId);
    const mbutilCommand = `mb-util ${mapId}.mbtiles --do_compression  --image_format=pbf --silent ./tiles`;
    const combinedCommand = `${changeDirectoryCommand} && ${mbutilCommand}`;
    await shellCommand(combinedCommand);
}