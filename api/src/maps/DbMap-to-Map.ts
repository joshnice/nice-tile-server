import type { Map } from "@nice-tile-server/types";
import type { DbMap } from "../types/db-map";

export function DbMapTileToMap(dbMapTile: DbMap): Map {
    return {
        id: dbMapTile.id,
        type: "map",
        name: dbMapTile.name,
        mapId: dbMapTile.id,
    }
}