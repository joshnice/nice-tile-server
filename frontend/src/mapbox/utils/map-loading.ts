import type { Map } from "mapbox-gl";

export function waitUntilMapHasLoaded(map: Map, callback: () => void) {
    if (map.loaded()) {
        callback();
        return;
    }

    map.once("load", () => {
        callback();
    })
}