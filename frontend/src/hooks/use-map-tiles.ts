import type { MapTile } from "@nice-tile-server/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const createKey = () => ["map-tiles"];

export default function useMapTiles(): {
    mapTiles: MapTile[],
    isMapTilesLoading: boolean,
    createMapTiles: (mapId: string) => Promise<void>
    invalidateMapTiles: () => void;
} {

    const queryClient = useQueryClient();

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: createKey() })
    }

    const { data, isLoading } = useQuery({ queryKey: createKey(), queryFn: listMapTiles })

    return { mapTiles: data, isMapTilesLoading: isLoading, createMapTiles, invalidateMapTiles: invalidate, }
}

async function createMapTiles(mapId: string) {
    await fetch(`http://localhost:3000/map-tiles/${mapId}`, {
        method: "Post",
        headers: { "Content-Type": "application/json" },
    });
}

async function listMapTiles() {
    const response = await fetch("http://localhost:3000/map-tiles", {
        method: "Get",
        headers: { "Content-Type": "applicaton/json" }
    });
    return response.json();
}