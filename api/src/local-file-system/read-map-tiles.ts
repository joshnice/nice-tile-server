import { readFile } from "./local-file-system-read-helpers";

const basePath = "/home/joshnice/Documents/mapbox-tiles"

export async function getLocalMapTile(x: number, y: number, z: number) {
    const file = await readFile(`${basePath}/nice-tile-server/${z}/${x}/${y}.pbf`, false);
    return file;
}