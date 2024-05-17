import { getLocalMapTile } from "../local-file-system/read-map-tiles";

export function getMapTile(x: number, y: number, z: number) {
    return getLocalMapTile(x, y, z);
}