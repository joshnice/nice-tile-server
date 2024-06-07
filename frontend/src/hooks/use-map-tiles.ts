export default function useMapTiles() {
    return { createMapTiles }
}

async function createMapTiles(mapId: string) {
    await fetch(`http://localhost:3000/map-tiles/${mapId}`, {
        method: "Post",
        headers: { "Content-Type": "application/json" },
    });
}