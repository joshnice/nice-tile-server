import type { MapTile } from "@nice-tile-server/types";
import type { DbMapTile } from "../types/db-map-tile";

export function DbMapTileToMapTile(dbMapTile: DbMapTile): MapTile {
    return {
        id: dbMapTile.id,
        type: "tile",
        name: dbMapTile.name,
        mapId: dbMapTile.map_id,
    }
}