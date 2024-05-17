import { readFile } from "./local-file-system-read-helpers";

const basePath = "/home/joshnice/Documents/mapbox-tiles"

export async function getLocalMapTile(x: number, y: number, z: number) {
    const file = await readFile(`${basePath}/tiles-v2/${z}/${x}/${y}.pbf`, false);
    return file;
}